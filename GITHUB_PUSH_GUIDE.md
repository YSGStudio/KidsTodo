# GitHub 코드 푸시 가이드

## 1단계: GitHub 저장소 생성

1. 브라우저에서 https://github.com/new 접속
2. 저장소 이름 입력 (예: `todo-app` 또는 `growth-fruit-todo`)
3. Public 또는 Private 선택
4. **"Initialize this repository with a README" 체크 해제** (이미 코드가 있으므로)
5. "Create repository" 클릭

## 2단계: GitHub에서 제공하는 명령어 확인

저장소 생성 후 GitHub에서 다음과 같은 명령어를 보여줍니다:

```
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 3단계: 로컬에서 실행

터미널에서 다음 명령어를 실행하세요:

```bash
cd /Users/yangseung-geun/TodoTest

# GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO를 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 브랜치 이름 확인 및 변경 (필요시)
git branch -M main

# 코드 푸시
git push -u origin main
```

## 예시

만약 GitHub 사용자명이 `yangseung-geun`이고 저장소 이름이 `todo-app`이라면:

```bash
git remote add origin https://github.com/yangseung-geun/todo-app.git
git branch -M main
git push -u origin main
```

## 문제 해결

### 이미 remote가 있는 경우
```bash
# 기존 remote 확인
git remote -v

# 기존 remote 제거 (필요시)
git remote remove origin

# 새 remote 추가
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### 인증 오류가 발생하는 경우
- GitHub Personal Access Token 사용 필요
- 또는 SSH 키 설정 필요

### 푸시가 거부되는 경우
```bash
# 강제 푸시 (주의: 기존 코드를 덮어씀)
git push -u origin main --force
```

