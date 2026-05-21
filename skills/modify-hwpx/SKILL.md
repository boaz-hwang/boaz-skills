---
name: modify-hwpx
description: 'HWPX(한글) 파일 수정 스킬. MCP 서버를 통해 HWPX 문서의 텍스트, 표, 이미지를 편집합니다. 키워드: hwpx, 한글 수정, hwpx 편집, 한글 편집, hwpx 수정, 한글파일 수정, 한글 문서 편집, hwpx edit, hwpx modify, 표 수정, 테이블 수정, 셀 수정, 행 삭제, 행 추가, hwpx mcp'
---

# HWPX (한글) 파일 수정

> HWPX 문서를 프로그래밍 방식으로 편집하는 스킬. 두 가지 방식을 지원한다.

## 핵심 요약

**방식 A (MCP)**: Claude Code + `@p.e.c/hwpx-mcp` MCP 서버 — 77개 도구로 편집
**방식 B (Fallback)**: Python lxml로 직접 XML 수정 — MCP 없는 환경(Codex, Gemini 등)에서 사용

```
방식 A: HWPX 파일 → MCP 서버로 열기 → 도구로 편집 → 저장
방식 B: HWPX(ZIP) → unzip → lxml로 section XML 수정 → zip CLI로 교체 → 저장
```

---

## 방식 A: MCP 서버 (Claude Code 전용)

### 사전 준비

```bash
# Claude Code에 MCP 서버 등록
claude mcp add --transport stdio --scope user hwpx-mcp -- npx -y @p.e.c/hwpx-mcp
# Claude Code 재시작 후 /mcp 로 확인
```

### 작업 워크플로우

### Step 1: 문서 열기

```
open_document로 HWPX 파일을 연다 → doc_id를 받는다
```

### Step 2: 구조 파악

```
get_document_structure → 섹션/테이블/문단 구조 확인
get_table_map → 테이블 위치와 헤더 확인
get_paragraphs → 문단 텍스트와 스타일 확인
```

### Step 3: 수정

**텍스트 수정:**
- `search_text` — 텍스트 검색
- `replace_text` — 텍스트 치환
- `batch_replace` — 여러 텍스트 일괄 치환
- `update_paragraph_text` — 문단 텍스트 직접 수정

**표(테이블) 수정:**
- `get_table` — 표 전체 조회
- `update_table_cell` — 셀 내용 수정
- `batch_fill_table` — 여러 셀 일괄 입력
- `insert_table_row` — 행 추가
- `delete_table_row` — 행 삭제 (병합 셀 rowSpan 자동 조정)
- `insert_table_column` / `delete_table_column` — 열 추가/삭제
- `merge_cells` / `split_cell` — 셀 병합/분할

**문단 수정:**
- `insert_paragraph` — 문단 삽입
- `delete_paragraph` — 문단 삭제
- `set_text_style` — 텍스트 스타일 변경 (굵기, 크기, 색상 등)
- `set_paragraph_style` — 문단 스타일 변경 (정렬, 줄간격 등)

**이미지:**
- `insert_image` — 이미지 삽입
- `insert_image_in_cell` — 표 셀 안에 이미지 삽입
- `render_mermaid` — Mermaid 다이어그램을 이미지로 삽입

### Step 4: 저장

```
save_document로 저장 (무결성 검증 자동 수행)
```

---

## 주요 도구 가이드 호출

작업 유형별로 최적 도구를 안내받을 수 있다:

```
get_tool_guide({ workflow: "template" })  → 양식 채우기
get_tool_guide({ workflow: "table" })     → 표 작업
get_tool_guide({ workflow: "search" })    → 검색/치환
get_tool_guide({ workflow: "image" })     → 이미지 삽입
get_tool_guide({ workflow: "read" })      → 문서 읽기
get_tool_guide({ workflow: "all" })       → 전체 도구 목록
```

---

## 표 수정 시 주의사항

### 병합 셀이 있는 표에서 행 삭제

병합 셀(rowSpan > 1)이 있는 표에서 행을 삭제하면:
- `rowSpan` 값 자동 조정
- `rowAddr` 재번호 자동 수행
- `rowCnt` 업데이트 자동 수행

이 처리가 없으면 한글 프로그램이 크래시합니다. `@p.e.c/hwpx-mcp`는 이 문제를 수정했습니다.

### 표 찾기 전략

1. `get_table_map` — 전체 표 목록과 헤더를 먼저 확인
2. `find_table_by_header` — 헤더 텍스트로 특정 표 검색
3. `get_table` — table_index로 표 상세 조회
4. `get_table_as_csv` — CSV 형태로 표 내용 확인

---

## HWP vs HWPX

| | HWP | HWPX |
|---|---|---|
| 구조 | 바이너리 | ZIP + XML |
| 이 스킬로 수정 | 불가 | 가능 |
| 읽기 | `read-hwp` 스킬 사용 | 이 스킬 사용 |

HWP 파일을 수정하려면 한글에서 HWPX로 다시 저장한 후 이 스킬을 사용합니다.

---

## Claude 작업 프로토콜

HWPX 파일 수정 요청 시 **반드시** 다음 순서를 따릅니다:

### Phase 0: MCP 서버 확인 및 설치

1. `mcp__hwpx-mcp__open_document` 도구가 사용 가능한지 확인한다 (ToolSearch로 `+hwpx-mcp open` 검색)
2. **도구가 있으면** → Phase 1로 바로 진행
3. **도구가 없으면** → 아래 명령을 실행하여 MCP 서버를 설치한다:

```bash
claude mcp add --transport stdio --scope user hwpx-mcp -- npx -y @p.e.c/hwpx-mcp
```

4. 사용자에게 "Claude Code를 재시작해주세요. MCP 서버가 로드되면 다시 /modify-hwpx 를 호출해주세요." 라고 안내한다
5. 재시작 후 이 스킬이 다시 호출되면 Phase 1부터 진행한다

### Phase 1: 문서 열기 및 구조 파악

1. `open_document`로 HWPX 파일을 연다 → `doc_id`를 받는다
2. `get_document_structure`로 섹션/테이블/문단 구조를 확인한다
3. 필요에 따라 `get_table_map`, `get_paragraphs` 등으로 상세 구조를 파악한다

### Phase 2: 수정 실행

1. 사용자 요청에 맞는 도구를 선택하여 편집한다
2. 수정 전 현재 상태를 먼저 확인한다 (get_table, get_paragraphs 등)
3. 수정을 실행한다

### Phase 3: 저장 및 검증

1. `save_document`로 저장한다 (원본 보존을 위해 다른 경로로 저장 권장)
2. `verify_integrity: true` 옵션으로 무결성 검증을 수행한다
3. 사용자에게 한글에서 열어 확인하도록 안내한다

---

## 방식 B: Python lxml Fallback (MCP 없는 환경)

MCP를 지원하지 않는 도구(Codex CLI, Gemini CLI 등)에서는 Python으로 직접 HWPX XML을 수정한다.

### 사전 준비

```bash
pip3 install lxml --break-system-packages
```

### HWPX 구조 이해

HWPX는 ZIP 파일이다. 내부 구조:
```
mimetype                    ← 시그니처 ("application/hwp+zip")
Contents/header.xml         ← 문서 스타일/폰트 정의
Contents/section0.xml       ← 본문 첫번째 섹션
Contents/section1.xml       ← 두번째 섹션 ...
Contents/content.hpf        ← 섹션 목록 (spine)
BinData/                    ← 이미지, OLE 객체
META-INF/                   ← 매니페스트
Preview/PrvText.txt         ← 텍스트 미리보기
```

### 파이프라인: 읽기 → 수정 → 저장

```python
from lxml import etree
import zipfile, shutil, subprocess, os

SRC = "원본.hwpx"
DST = "수정본.hwpx"
SECTION = "Contents/section0.xml"

# 1. 원본에서 XML 읽기
with zipfile.ZipFile(SRC, 'r') as z:
    data = z.read(SECTION)

root = etree.fromstring(data)
ns_p = 'http://www.hancom.co.kr/hwpml/2011/paragraph'

# 2. 수정 (예시: 텍스트 치환)
for t_elem in root.iter(f'{{{ns_p}}}t'):
    if t_elem.text and '치환대상' in t_elem.text:
        t_elem.text = t_elem.text.replace('치환대상', '새텍스트')

# 3. XML 직렬화 (원본 선언부 보존)
xml_out = etree.tostring(root, xml_declaration=False, encoding='unicode')
final = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>' + xml_out
final_bytes = final.encode('utf-8')

# 4. 임시 파일에 저장
import tempfile
tmpdir = tempfile.mkdtemp()
os.makedirs(os.path.join(tmpdir, 'Contents'), exist_ok=True)
with open(os.path.join(tmpdir, SECTION), 'wb') as f:
    f.write(final_bytes)

# 5. 원본 복사 후 zip CLI로 해당 파일만 교체
shutil.copy2(SRC, DST)
subprocess.run(['zip', DST, SECTION], cwd=tmpdir)
```

**중요**: Python `zipfile`로 전체 재패키징하면 파일이 손상될 수 있다. 반드시 **원본을 복사**하고 **`zip` CLI로 수정된 XML만 교체**한다.

### 표(테이블) 행 삭제 시 필수 처리

병합 셀(rowSpan > 1)이 있는 표에서 행을 삭제할 때 **3가지를 반드시 함께 처리**해야 한다. 누락하면 한글이 크래시한다.

```python
ns_p = 'http://www.hancom.co.kr/hwpml/2011/paragraph'

def get_all_text(elem):
    return ''.join(elem.itertext())

def delete_table_rows(root, table_index, rows_to_remove):
    """
    표에서 행을 삭제한다. rowSpan/rowAddr/rowCnt를 자동 조정한다.

    Args:
        root: section XML의 lxml root element
        table_index: 삭제 대상 테이블 인덱스 (0-based)
        rows_to_remove: 삭제할 행 인덱스 set (예: {9, 10, 11})
    """
    tables = list(root.iter(f'{{{ns_p}}}tbl'))
    if table_index >= len(tables):
        return False

    tbl = tables[table_index]
    all_rows = tbl.findall(f'{{{ns_p}}}tr')

    # 1. rowSpan 조정: 삭제되지 않는 행의 셀이 삭제 행에 걸쳐있으면 rowSpan 줄이기
    for i, tr in enumerate(all_rows):
        if i in rows_to_remove:
            continue
        for tc in tr.findall(f'{{{ns_p}}}tc'):
            addr = tc.find(f'{{{ns_p}}}cellAddr')
            span = tc.find(f'{{{ns_p}}}cellSpan')
            if addr is None or span is None:
                continue

            row_addr = int(addr.get('rowAddr'))
            row_span = int(span.get('rowSpan'))
            if row_span <= 1:
                continue

            # 이 셀의 span 범위 내에 삭제 대상 행이 몇 개 있는지 계산
            span_range = set(range(row_addr, row_addr + row_span))
            overlap = span_range & rows_to_remove
            if overlap:
                span.set('rowSpan', str(row_span - len(overlap)))

    # 2. 행 삭제 (역순)
    for i in sorted(rows_to_remove, reverse=True):
        if i < len(all_rows):
            tbl.remove(all_rows[i])

    # 3. rowAddr 재번호
    remaining_rows = tbl.findall(f'{{{ns_p}}}tr')
    for new_idx, tr in enumerate(remaining_rows):
        for tc in tr.findall(f'{{{ns_p}}}tc'):
            addr = tc.find(f'{{{ns_p}}}cellAddr')
            if addr is not None:
                addr.set('rowAddr', str(new_idx))

    # 4. rowCnt 업데이트
    tbl.set('rowCnt', str(len(remaining_rows)))
    return True
```

사용 예시:

```python
# 표 0번에서 행 9, 10, 11 삭제
delete_table_rows(root, table_index=0, rows_to_remove={9, 10, 11})
```

### 텍스트 검색/치환

```python
# 문서 전체에서 텍스트 검색
for t_elem in root.iter(f'{{{ns_p}}}t'):
    if t_elem.text and '검색어' in t_elem.text:
        print(f"Found: {t_elem.text}")

# 치환
for t_elem in root.iter(f'{{{ns_p}}}t'):
    if t_elem.text and '이전값' in t_elem.text:
        t_elem.text = t_elem.text.replace('이전값', '새값')
```

### 표 구조 확인

```python
for i, tbl in enumerate(root.iter(f'{{{ns_p}}}tbl')):
    print(f"Table {i}: rowCnt={tbl.get('rowCnt')}, colCnt={tbl.get('colCnt')}")
    for j, tr in enumerate(tbl.findall(f'{{{ns_p}}}tr')):
        for tc in tr.findall(f'{{{ns_p}}}tc'):
            addr = tc.find(f'{{{ns_p}}}cellAddr')
            span = tc.find(f'{{{ns_p}}}cellSpan')
            text = get_all_text(tc).strip()[:30]
            ra = addr.get('rowAddr') if addr is not None else '?'
            rs = span.get('rowSpan') if span is not None else '1'
            if text:
                print(f"  Row {j} Cell: rowAddr={ra} rowSpan={rs} '{text}'")
```

### Fallback 작업 프로토콜

MCP가 없는 환경에서 HWPX 수정 요청 시:

1. **lxml 확인**: `python3 -c "from lxml import etree"` 실행. 없으면 설치
2. **구조 파악**: `unzip -l 파일.hwpx`로 내부 구조 확인
3. **텍스트 미리보기**: `Preview/PrvText.txt` 추출하여 내용 파악
4. **XML 읽기**: 대상 section XML을 zipfile로 읽기
5. **lxml로 수정**: 텍스트 치환, 행 삭제 등 실행 (위 함수 사용)
6. **원본 복사 + zip CLI 교체**: Python zipfile로 재패키징하지 않는다
7. **검증**: 한글에서 열어 확인하도록 안내
