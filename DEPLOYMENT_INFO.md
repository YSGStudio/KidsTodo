# 배포 정보

## 자동 재배포 vs 수동 재배포

### 자동 재배포 (기본 설정)

**Vercel은 GitHub와 연동되어 있으면 자동으로 재배포됩니다.**

1. **GitHub에 코드 푸시**
   ```bash
   git push origin main
   ```

2. **Vercel이 자동으로 감지**
   - GitHub webhook을 통해 자동 감지
   - 새로운 커밋이 있으면 자동으로 배포 시작

3. **배포 상태 확인**
   - Vercel 대시보드 → Deployments 탭
   - 최신 배포 상태 확인

### 수동 재배포가 필요한 경우

다음 경우에는 수동으로 재배포해야 합니다:

1. **환경 변수 변경 후**
   - Settings → Environment Variables 수정
   - Deployments → 최신 배포 → "Redeploy" 클릭

2. **자동 배포가 실패한 경우**
   - Deployments → 실패한 배포 → "Redeploy" 클릭

3. **특정 커밋으로 재배포하고 싶은 경우**
   - Deployments → 해당 배포 → "..." 메뉴 → "Redeploy"

## 현재 상태 확인

### 자동 배포 확인 방법

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Git 확인**
   - 연결된 저장소 확인
   - GitHub 저장소가 연결되어 있으면 자동 배포 활성화

3. **Deployments 탭 확인**
   - 최신 배포가 "Building" 또는 "Ready" 상태인지 확인
   - 최근 커밋 메시지가 표시됨

## 배포 상태 확인

### 자동 배포가 작동하는지 확인

1. **GitHub에 푸시한 시간 확인**
   ```bash
   git log --oneline -1
   ```

2. **Vercel Deployments 확인**
   - 최신 배포의 시간이 푸시 시간과 비슷한지 확인
   - "Building" 또는 "Ready" 상태인지 확인

### 배포가 안 되는 경우

1. **Git 연결 확인**
   - Vercel → Settings → Git
   - GitHub 저장소가 연결되어 있는지 확인

2. **Webhook 확인**
   - GitHub → 저장소 → Settings → Webhooks
   - Vercel webhook이 있는지 확인

3. **수동 재배포**
   - Deployments → "Redeploy" 클릭

## 요약

✅ **기본적으로 자동 재배포됩니다**
- GitHub에 푸시하면 자동으로 배포 시작
- 별도 작업 불필요

⚠️ **수동 재배포가 필요한 경우**
- 환경 변수 변경 후
- 자동 배포 실패 시
- 특정 커밋으로 재배포하고 싶을 때

