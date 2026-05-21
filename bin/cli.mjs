#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { intro, outro, multiselect, confirm, log, cancel, isCancel } from '@clack/prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

const SKILL_META = {
  'visualize-notion': {
    name: 'visualize-notion',
    description: '노션 문서 작성 시 Mermaid, Callout, Table 등 시각화 도구 활용 가이드',
  },
  'debug': {
    name: 'debug',
    description: 'Kernighan/Pike/Feathers/Gregg 방법론 기반 체계적 디버깅 워크플로우',
  },
  'read-hwp': {
    name: 'read-hwp',
    description: 'HWP(한글) 파일을 hwp5html로 텍스트 변환하는 파이프라인',
  },
  'modify-hwpx': {
    name: 'modify-hwpx',
    description: 'HWPX(한글) 파일 수정 — @p.e.c/hwpx-mcp MCP 서버 기반 편집',
  },
  'recommend-static-test-tools': {
    name: 'recommend-static-test-tools',
    description: '프레임워크 감지 → ESLint 플러그인/정적 분석 도구 추천 (설치 없이 보고서만 출력, 자기개선 루프)',
  },
};

const TARGETS = {
  'claude-code': {
    label: 'Claude Code',
    dir: path.join(os.homedir(), '.claude', 'skills'),
    detect: () => fs.existsSync(path.join(os.homedir(), '.claude')),
  },
  'codex': {
    label: 'Codex CLI',
    dir: path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills'),
    detect: () => fs.existsSync(process.env.CODEX_HOME || path.join(os.homedir(), '.codex')),
  },
  'gemini': {
    label: 'Gemini CLI',
    dir: path.join(os.homedir(), '.gemini', 'skills'),
    detect: () => fs.existsSync(path.join(os.homedir(), '.gemini')),
  },
};

function getAvailableSkills() {
  return fs.readdirSync(SKILLS_DIR).filter(name => {
    const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
    return fs.existsSync(skillPath);
  });
}

function copySkill(skillName, targetDir) {
  const src = path.join(SKILLS_DIR, skillName);
  const dest = path.join(targetDir, skillName);
  fs.cpSync(src, dest, { recursive: true });
}

async function main() {
  const args = process.argv.slice(2);
  const availableSkills = getAvailableSkills();

  // --list: 스킬 목록 출력
  if (args.includes('--list')) {
    console.log('\n  @p.e.c/boaz-skills\n');
    for (const skill of availableSkills) {
      const meta = SKILL_META[skill];
      console.log(`  ${skill}`);
      if (meta?.description) console.log(`    ${meta.description}`);
    }
    console.log('');
    process.exit(0);
  }

  intro('@p.e.c/boaz-skills');

  // 설치 대상 감지
  const detectedTargets = Object.entries(TARGETS)
    .filter(([, t]) => t.detect())
    .map(([key, t]) => ({ key, ...t }));

  if (detectedTargets.length === 0) {
    log.error('지원되는 AI 코딩 도구를 찾을 수 없습니다.');
    log.info('지원: Claude Code (~/.claude/), Codex CLI (~/.codex/), Gemini CLI (~/.gemini/)');
    process.exit(1);
  }

  log.info(`감지된 도구: ${detectedTargets.map(t => t.label).join(', ')}`);

  const installAll = args.includes('--all');

  // 설치 대상 도구 선택
  let selectedTargets;

  if (installAll || detectedTargets.length === 1) {
    selectedTargets = detectedTargets;
  } else {
    const targetResult = await multiselect({
      message: '설치할 도구를 선택하세요',
      options: detectedTargets.map(t => ({
        label: t.label,
        value: t,
      })),
      initialValues: detectedTargets,
    });

    if (isCancel(targetResult)) {
      cancel('취소되었습니다.');
      process.exit(0);
    }

    selectedTargets = targetResult;
  }

  // 스킬 선택
  let selectedSkills;

  if (installAll) {
    selectedSkills = availableSkills;
  } else {
    const skillResult = await multiselect({
      message: '설치할 스킬을 선택하세요',
      options: availableSkills.map(skill => ({
        label: skill,
        hint: SKILL_META[skill]?.description || '',
        value: skill,
      })),
      initialValues: availableSkills,
    });

    if (isCancel(skillResult)) {
      cancel('취소되었습니다.');
      process.exit(0);
    }

    selectedSkills = skillResult;
  }

  // 설치 실행
  for (const target of selectedTargets) {
    fs.mkdirSync(target.dir, { recursive: true });

    for (const skill of selectedSkills) {
      const destPath = path.join(target.dir, skill);
      const exists = fs.existsSync(destPath);

      if (exists && !installAll) {
        const overwrite = await confirm({
          message: `${skill} 이미 설치됨. 덮어쓸까요?`,
          initialValue: true,
        });

        if (isCancel(overwrite) || !overwrite) {
          log.warn(`${skill} 건너뜀`);
          continue;
        }
      }

      copySkill(skill, target.dir);
      log.success(`${skill} → ${target.label}`);
    }
  }

  outro('설치 완료!');
}

main().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
