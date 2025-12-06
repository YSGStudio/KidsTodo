# 403 오류 해결 방법

## 문제 원인
"Permission denied to YSGStudio" 오류는 토큰이 해당 저장소에 대한 권한이 없을 때 발생합니다.

## 해결 방법

### 방법 1: Classic Token 사용 (가장 확실)

1. **새 Classic Token 생성**
   - https://github.com/settings/tokens/new 접속
   - "Generate new token" → **"Generate new token (classic)"** 선택
   - Note: `Todo App Deploy` 입력
   - Expiration: 원하는 기간 선택
   - **Scopes에서 `repo` 전체 체크** (모든 하위 항목 포함)
   - "Generate token" 클릭
   - 토큰 복사

2. **토큰으로 푸시**
   ```bash
   cd /Users/yangseung-geun/TodoTest
   git remote set-url origin https://github.com/YSGStudio/KidsTodo.git
   git push -u origin main
   ```
   - Username: `YSGStudio`
   - Password: 새로 생성한 Classic Token

### 방법 2: Fine-grained Token 권한 확인

Fine-grained token을 사용하는 경우:

1. https://github.com/settings/tokens 접속
2. 토큰 클릭하여 편집
3. "Repository access" 확인:
   - "Only select repositories" 선택 시
   - `YSGStudio/KidsTodo` 저장소가 목록에 있는지 확인
   - 없으면 "Add repository"로 추가
4. "Repository permissions" 확인:
   - Contents: Read and write
   - Metadata: Read-only
5. 저장 후 다시 푸시 시도

### 방법 3: SSH 키 사용 (권장, 가장 안전)

```bash
# 1. SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"
# 엔터 3번 (기본 설정)

# 2. 공개 키 복사
cat ~/.ssh/id_ed25519.pub
# 출력된 내용 전체 복사

# 3. GitHub에 SSH 키 등록
# - https://github.com/settings/keys 접속
# - "New SSH key" 클릭
# - 복사한 키 붙여넣기 후 저장

# 4. SSH URL로 변경
cd /Users/yangseung-geun/TodoTest
git remote set-url origin git@github.com:YSGStudio/KidsTodo.git

# 5. 푸시
git push -u origin main
```

### 방법 4: GitHub CLI 사용

```bash
# GitHub CLI 설치
brew install gh

# 로그인
gh auth login

# 푸시
cd /Users/yangseung-geun/TodoTest
git push -u origin main
```

