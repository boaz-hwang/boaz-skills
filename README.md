# boaz-skills

AI 코딩 도구용 스킬 모음. Claude Code, Codex, Gemini CLI에서 바로 사용 가능합니다.

## 설치

[Vercel Labs `skills` CLI](https://www.npmjs.com/package/skills)로 설치합니다.

```bash
# 대화형 선택 설치
npx skills add boaz-hwang/boaz-skills

# 전체 설치
npx skills add boaz-hwang/boaz-skills --all

# 특정 스킬만 설치
npx skills add boaz-hwang/boaz-skills -s debug
npx skills add boaz-hwang/boaz-skills -s debug,read-hwp

# 저장소 내 스킬 목록 확인
npx skills add boaz-hwang/boaz-skills --list
```

설치 위치는 자동 감지된 에이전트(Claude Code / Codex / Gemini 등)에 맞춰집니다. 전역 설치는 `-g`를 붙입니다.

## 포함된 스킬

| 스킬 | 설명 |
|------|------|
| **visualize-notion** | 노션 문서 작성 시 Mermaid, Callout, Table 등 시각화 도구 활용 가이드 |
| **debug** | Kernighan/Pike/Feathers/Gregg 방법론 기반 체계적 디버깅 워크플로우 |
| **read-hwp** | HWP(한글) 파일을 hwp5html로 텍스트 변환하는 파이프라인 |
| **modify-hwpx** | HWPX(한글) 파일 수정 — @p.e.c/hwpx-mcp MCP 서버 기반 편집 |
| **recommend-static-test-tools** | 프레임워크 감지 → ESLint 플러그인/정적 분석 도구 추천 (Skill 2.0 자기개선 루프) |

## 라이선스

MIT
