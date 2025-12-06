# GitHub 인증 가이드

## Personal Access Token 생성

1. GitHub에 로그인
2. 우측 상단 프로필 클릭 → Settings
3. 좌측 메뉴에서 "Developer settings" 클릭
4. "Personal access tokens" → "Tokens (classic)" 클릭
5. "Generate new token" → "Generate new token (classic)" 클릭
6. Note: "Todo App Deploy" 입력
7. Expiration: 원하는 기간 선택
8. Scopes: `repo` 체크 (전체 저장소 권한)
9. "Generate token" 클릭
10. **토큰을 복사해두세요** (한 번만 보여줍니다!)

## 토큰으로 푸시하기

터미널에서 다음 명령어 실행:

```bash
cd /Users/yangseung-geun/TodoTest

# 사용자명과 토큰으로 푸시
git push -u origin main
```

사용자명 입력 시: GitHub 사용자명 (예: YSGStudio)
비밀번호 입력 시: 방금 생성한 Personal Access Token 붙여넣기

## 또는 SSH 키 사용 (권장)

SSH 키를 사용하면 매번 토큰을 입력할 필요가 없습니다.

### SSH 키 생성 및 등록

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub
```

1. GitHub → Settings → SSH and GPG keys
2. "New SSH key" 클릭
3. 복사한 공개 키 붙여넣기
4. 저장

### SSH URL로 변경

```bash
git remote set-url origin git@github.com:YSGStudio/KidsTodo.git
git push -u origin main
```

