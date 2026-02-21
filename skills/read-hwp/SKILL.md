---
name: read-hwp
description: 'HWP(한글) 파일 읽기 스킬. hwp5html을 사용하여 HWP 파일을 텍스트로 변환합니다. 키워드: hwp, 한글, hangul, hwp파일, hwp 읽기, hwp 변환, 한글파일, 한글 파일, .hwp, hwp파일 읽기, 한글문서, 한글 문서, hwp문서, hwp 문서, 아래아한글, 한컴, 한글파일 변환, 한글파일 열기'
---

# HWP (한글) 파일 읽기

> macOS/Linux 환경에서 HWP 파일의 텍스트를 안정적으로 추출하는 검증된 파이프라인

## 핵심 요약

**유일하게 작동하는 방법**: `hwp5html` 변환 → `index.xhtml` 파싱 → 텍스트 추출

```
HWP 파일 → hwp5html → XHTML 디렉토리 → HTML 태그 제거 → 클린 텍스트
```

---

## 사전 준비 (Prerequisites)

```bash
pip3 install pyhwp olefile --break-system-packages
```

설치 확인:
```bash
which hwp5html  # /opt/homebrew/bin/hwp5html 또는 유사 경로
```

---

## 변환 파이프라인

### Step 1: HWP → XHTML 변환

```bash
# 출력 디렉토리 생성 (hwp5html은 디렉토리를 생성함)
mkdir -p /tmp/hwp_converted
hwp5html "입력파일.hwp" --output /tmp/hwp_converted/output.html
```

**중요**: `--output` 경로는 **디렉토리**로 생성됨 (파일이 아님)
- `/tmp/hwp_converted/output.html/index.xhtml` ← 본문 내용
- `/tmp/hwp_converted/output.html/styles.css` ← 스타일 정보

### Step 2: XHTML에서 텍스트 추출

```python
import re, html

# XHTML 파일 읽기
with open('/tmp/hwp_converted/output.html/index.xhtml', 'r', encoding='utf-8') as f:
    content = f.read()

# HTML 태그 제거
text = re.sub(r'<[^>]+>', '\n', content)
text = html.unescape(text)

# 공백 정리
text = re.sub(r'[ \t]+', ' ', text)
lines = [l.strip() for l in text.split('\n') if l.strip()]

# CSS/스타일 라인 건너뛰기 (앞부분에 CSS 규칙이 포함됨)
css_patterns = re.compile(r'^(\.|{|}|width|height|margin|padding|position|font|border|color|display|overflow|text-|line-|letter-|word-|vertical-|background|content|@|/\*)')
start = 0
for i, l in enumerate(lines):
    if not css_patterns.match(l):
        start = i
        break

clean_text = '\n'.join(lines[start:])

# 파일로 저장 (대용량 문서의 경우 컨텍스트 절약)
with open('/tmp/hwp_converted/result.txt', 'w', encoding='utf-8') as f:
    f.write(clean_text)

print(f"추출 완료: {len(lines[start:])} 줄")
```

### Step 3: 결과 읽기

```bash
# 추출된 텍스트 확인
cat /tmp/hwp_converted/result.txt
```

---

## 여러 HWP 파일 일괄 처리

```bash
# 디렉토리 내 모든 HWP 파일 변환
for hwp_file in /path/to/directory/*.hwp; do
    filename=$(basename "$hwp_file" .hwp)
    mkdir -p "/tmp/hwp_converted/${filename}.html"
    hwp5html "$hwp_file" --output "/tmp/hwp_converted/${filename}.html"
done
```

```python
import os, re, html, glob

results = {}
for xhtml_path in glob.glob('/tmp/hwp_converted/*.html/index.xhtml'):
    dirname = os.path.basename(os.path.dirname(xhtml_path)).replace('.html', '')
    with open(xhtml_path, 'r', encoding='utf-8') as f:
        content = f.read()
    text = re.sub(r'<[^>]+>', '\n', content)
    text = html.unescape(text)
    text = re.sub(r'[ \t]+', ' ', text)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    # CSS 건너뛰기
    start = 0
    for i, l in enumerate(lines):
        if not l.startswith('.') and not l.startswith('{') and not l.startswith('width'):
            start = i
            break
    clean = '\n'.join(lines[start:])
    # 개별 파일로 저장
    out_path = f'/tmp/hwp_converted/{dirname}.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(clean)
    results[dirname] = len(lines[start:])
    print(f"{dirname}: {len(lines[start:])} 줄 추출")
```

---

## 실패하는 방법들 (시도하지 말 것)

| 방법 | 문제점 | 상세 |
|------|--------|------|
| **olefile 직접 파싱** | 텍스트 깨짐 | BodyText 섹션의 zlib 해제 후 UTF-16LE 디코드 시 바이너리 쓰레기 혼재. HWP 문단 구조를 올바르게 파싱 불가 |
| **hwp5txt** | 내용 누락 | 표(테이블) 위주 문서에서 `<표>` 마커만 출력하고 본문 내용 없음 |
| **LibreOffice (soffice)** | 로드 실패 | `--headless --convert-to pdf` 실행 시 "source file could not be loaded" 오류. macOS LibreOffice에 HWP 포맷 지원 없음 |
| **hwp5odt** | 검증 오류 | `hwp5.errors.ValidationFailed: RelaxNG` 오류 발생. ODF 스타일 속성 검증 실패. pyhwp 패치 없이 수정 불가 |

---

## 트러블슈팅

### hwp5html 실행 시 오류

**증상**: `ModuleNotFoundError: No module named 'hwp5'`
```bash
pip3 install pyhwp --break-system-packages
```

**증상**: `FileNotFoundError` (출력 경로)
```bash
# 부모 디렉토리가 존재하는지 확인
mkdir -p /tmp/hwp_converted
# 출력 디렉토리가 이미 존재하면 삭제
rm -rf /tmp/hwp_converted/output.html
hwp5html "file.hwp" --output /tmp/hwp_converted/output.html
```

**증상**: 빈 index.xhtml 생성
- 일부 HWP 파일은 hwp5html도 처리 불가 (매우 드묾)
- 이 경우 Windows에서 한글 프로그램으로 직접 변환 필요

### 한글 인코딩 관련

**ZIP 파일 내 한글 파일명 깨짐** (macOS):
```bash
# macOS의 unzip은 EUC-KR 인코딩을 처리 못함
# Python으로 해결:
python3 -c "
import zipfile, os
with zipfile.ZipFile('archive.zip', 'r') as z:
    for info in z.infolist():
        try:
            decoded = info.filename.encode('cp437').decode('euc-kr')
        except:
            decoded = info.filename
        info.filename = decoded
        z.extract(info, '/tmp/extracted/')
"
```

---

## Claude 작업 프로토콜

HWP 파일 읽기 요청 시 다음 순서를 따름:

1. **사전 확인**: `which hwp5html`로 설치 여부 확인
2. **미설치 시**: `pip3 install pyhwp olefile --break-system-packages` 실행
3. **변환**: `hwp5html` → XHTML 디렉토리 생성
4. **추출**: Python으로 XHTML 파싱 → 클린 텍스트
5. **저장**: `/tmp/hwp_converted/` 에 텍스트 파일로 저장 (대용량 문서는 컨텍스트에 직접 넣지 않음)
6. **보고**: 추출된 내용 요약 또는 전문 제공

### 대용량 문서 처리 전략

- 1000줄 이상: 파일로 저장 후 필요한 부분만 Read로 읽기
- 여러 HWP 파일: 일괄 변환 후 파일별 요약 제공
- 표(테이블) 데이터: XHTML의 `<td>` 태그 구조를 활용하여 표 형태 복원 가능
