# 수동 푸시 방법

토큰 인증에 문제가 있는 경우, 다음 방법을 시도해보세요:

## 방법 1: Git Credential Helper 사용

터미널에서 다음 명령어를 실행하세요:

```bash
cd /Users/yangseung-geun/TodoTest

# Credential helper 설정
git config --global credential.helper store

# 푸시 시도 (인증 정보 입력)
git push -u origin main
```

Username: `YSGStudio`
Password: `[YOUR_PERSONAL_ACCESS_TOKEN]` (토큰을 입력하세요)

## 방법 2: 토큰 확인 사항

1. **토큰 권한 확인**
   - GitHub → Settings → Developer settings → Personal access tokens
   - 토큰의 `repo` 권한이 체크되어 있는지 확인

2. **토큰 만료 확인**
   - 토큰이 만료되지 않았는지 확인

3. **새 토큰 생성** (필요시)
   - 기존 토큰 삭제 후 새로 생성
   - Scopes에서 `repo` 전체 권한 체크

## 방법 3: GitHub CLI 사용

```bash
# GitHub CLI 설치 (없는 경우)
brew install gh

# 로그인
gh auth login

# 푸시
git push -u origin main
```

