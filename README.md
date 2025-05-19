# 과제

## API 목록

### 공통 응답

- 응답 실패:
  ```json
  {
    "success": false,
    "message": "실패 사유"
  }
  ```
- 권한 없음:
  ```json
  {
    "message": "Unauthorized",
    "statusCode": 401
  }
  ```

### Auth Server 관련

#### POST /login

- 요청 예시:
  ```json
  {
    "id": "user_id",
    "password": "user_password"
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "access_token": "JWT_ACCESS_TOKEN"
  }
  ```

#### POST /register

- 요청 예시:
  ```json
  {
    "id": "user_id",
    "password": "user_password",
    "role": "USER" // "USER", "OPERATOR", "AUDITOR", "ADMIN" 중 하나
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "message": "User registered"
  }
  ```

### Event Server 관련

#### POST /event_new

- 요청 예시:
  ```json
  {
    "name": "이벤트",
    "startDate": "2025-06-01",
    "endDate": "2025-06-10",
    "condition": "로그인 3일",
    "status": "active" // "active", "inactive" 중 하나
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "eventId": "이벤트 ID"
  }
  ```

#### POST /event_log

- 요청 예시:
  ```json
  {
    "name": "이벤트",
    "startDate": "2025-06-01",
    "endDate": "2025-06-10",
    "condition": "로그인 3일",
    "status": "active" // "active", "inactive" 중 하나
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "events": ["이벤트 정보1", "이벤트 정보2", ...]
  }
  ```

#### POST /reward_new

- 요청 예시:
  ```json
  {
    "event_id": "682b46701dfef68936367b51", // event_new, event_log에서 확인한 eventId/_id
    "items": [
      { "item": "솔 에르다 조각", "amount": 5 },
      { "item": "파워 엘릭서", "amount": 100 }
    ]
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "rewardId": "reward ID"
  }
  ```

#### POST /reward_log

- 요청 예시:

  ```json
  {
    "event_id": "682b46701dfef68936367b51", // event_new, event_log에서 확인한 eventId/_id
    "reward_id": "682b4f331c20b5ee13b4562d" // reward_new, reward_log에서 확인한 rewardId/_id
  }
  ```

- 응답 예시:
  ```json
  {
    "success": true,
    "events": ["보상 정보1", "보상 정보2", ...]
  }
  ```

#### POST /reward_claim

- 요청 예시:
  ```json
  {
    "event_id": "682b46701dfef68936367b51" // event_new, event_log에서 확인한 eventId/_id
  }
  ```
- 응답 예시:
  ```json
  {
    "success": true,
    "message": "보상을 성공적으로 지급하였습니다.",
    "items": [
      { "item": "솔 에르다 조각", "amount": 5 },
      { "item": "파워 엘릭서", "amount": 100 }
    ]
  }
  ```

#### POST /reward_claim_log

- 요청 예시:

  ```json
  {
    "claim_id": "682b5c577aa1a3b19e289908", // DB에 있는 claim의 _id
    "event_id": "682b46701dfef68936367b51", // event_new, event_log에서 확인한 eventId/_id
    "search_user": "682aec217cd0e746b7e810c3" // 검색할 User의 _id, 검색자가 ADMIN/AUDITOR/OPERATOR일 때만 유효
  }
  ```

- 응답 예시:
  ```json
  {
    "success": true,
    "events": ["보상 정보1", "보상 정보2", ...]
  }
  ```

## 미구현 사항

- 유저 생성 시 권한 제어
- Gateway 및 Event에서의 jest testing
- reward DB에서 items의 구조 개선 (list형식에서 개선)
- 시스템의 조건 충족 여부는 외부 시스템 연동될 것으로 보아 임시로 DB(event.validity)에 묶어 두었지만, 해당 부분 외부 시스템 로직 연동
- claim 시 가용 아이템 슬롯이 부족한 경우 등의 예외 처리
