#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import prompts from 'prompts';

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
};

const TARGETS = {
  'claude-code': {
    label: 'Claude Code',
    dir: path.join(os.homedir(), '.claude', 'skills'),
    detect: () => fs.existsSync(path.join(os.homedir(), '.claude')),
  },
  // 향후 확장
  // 'codex': { label: 'Codex', dir: ..., detect: () => ... },
  // 'gemini': { label: 'Gemini', dir: ..., detect: () => ... },
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

  console.log('');
  console.log('  ⚡ @boaz/skills');
  console.log('  AI 코딩 도구용 스킬 설치기');
  console.log('');

  const availableSkills = getAvailableSkills();

  // --list: 스킬 목록 출력
  if (args.includes('--list')) {
    console.log('  사용 가능한 스킬:');
    for (const skill of availableSkills) {
      const meta = SKILL_META[skill];
      console.log(`    - ${skill}: ${meta?.description || ''}`);
    }
    console.log('');
    process.exit(0);
  }

  // 설치 대상 감지
  const detectedTargets = Object.entries(TARGETS)
    .filter(([, t]) => t.detect())
    .map(([key, t]) => ({ key, ...t }));

  if (detectedTargets.length === 0) {
    console.log('  ⚠ 지원되는 AI 코딩 도구를 찾을 수 없습니다.');
    console.log('  현재 지원: Claude Code (~/.claude/)');
    process.exit(1);
  }

  console.log(`  감지된 도구: ${detectedTargets.map(t => t.label).join(', ')}`);
  console.log('');

  // --all: 전체 설치 (대화형 건너뛰기)
  const installAll = args.includes('--all');

  let selectedSkills;

  if (installAll) {
    selectedSkills = availableSkills;
  } else {
    const choices = availableSkills.map(skill => ({
      title: skill,
      description: SKILL_META[skill]?.description || '',
      value: skill,
      selected: true,
    }));

    const response = await prompts({
      type: 'multiselect',
      name: 'skills',
      message: '설치할 스킬을 선택하세요 (Space로 토글, Enter로 확인)',
      choices,
      hint: '- 방향키로 이동, Space로 선택/해제',
      instructions: false,
    });

    if (!response.skills || response.skills.length === 0) {
      console.log('  선택된 스킬이 없습니다. 종료합니다.');
      process.exit(0);
    }

    selectedSkills = response.skills;
  }

  // 설치 실행
  for (const target of detectedTargets) {
    // 디렉토리 생성
    fs.mkdirSync(target.dir, { recursive: true });

    for (const skill of selectedSkills) {
      const destPath = path.join(target.dir, skill);
      const exists = fs.existsSync(destPath);

      if (exists && !installAll) {
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `${skill}이(가) 이미 설치되어 있습니다. 덮어쓸까요?`,
          initial: true,
        });

        if (!overwrite) {
          console.log(`  ⏭ ${skill} 건너뜀`);
          continue;
        }
      }

      copySkill(skill, target.dir);
      console.log(`  ✓ ${skill} → ${target.label}`);
    }
  }

  console.log('');
  console.log('  설치 완료!');
  console.log('');
}

main().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
