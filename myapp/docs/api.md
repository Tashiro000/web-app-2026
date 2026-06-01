# API仕様

## POST /api/tasks
説明：新しいタスクを追加する

リクエスト：
```json
{
  "title": "レポートを提出する",
  "status": "todo"
}
```

レスポンス：
```json
{
  "title": "レポートを提出する",
  "status": "todo"
}
```

---

## GET /api/tasks
説明：タスク一覧を取得する

レスポンス：
```json
[
  {
    "id": 1,
    "title": "レポートを提出する",
    "status": "todo"
  }
]
```