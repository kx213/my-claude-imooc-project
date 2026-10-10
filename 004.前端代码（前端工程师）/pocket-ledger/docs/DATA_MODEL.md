# 数据模型

> 全部数据存在浏览器 `localStorage` 中（key 前缀 `ma_`）。对齐
> [001.产品PRD（V1.0.1）.md](../001.产品PRD（产品经理）/001.产品PRD（V1.0.1）.md) §6.3。

## Key 一览

| Key | 类型 | 说明 |
| --- | --- | --- |
| `ma_users` | `Record<string, User>` | 用户索引表（key = username） |
| `ma_current_userId` | `string` | 当前登录用户名（已登录时存在） |
| `ma_books` | `Book[]` | 所有账本（按 ownerId 过滤） |
| `ma_records` | `Record[]` | 所有记录（按 ownerId 过滤） |
| `ma_categories` | `Category[]` | 所有分类（按 ownerId 过滤） |
| `ma_budgets` | `Budget[]` | 所有预算（按 ownerId 过滤） |
| `ma_lastBackupAt` | `string (ISO)` | 当前用户上次导出时间（PRD §13.3） |
| `ma_lastBackupDismiss` | `string (ISO)` | 「我知道了」点击时间，7 天静默（PRD §13.3） |
| `ma_login_failures` | `string (int)` | 登录失败计数（5 次清零后冷却） |
| `ma_login_cooldown_until` | `string (ts)` | 冷却结束时间戳 |

## User

```ts
{
  salt: string;            // 16 字节随机 salt，hex
  hash: string;            // PBKDF2-SHA256 100000 次 hash，hex
  iterations: number;      // PBKDF2 迭代次数（默认 100000）
  displayName: string;     // 显示昵称（默认 = username）
  createdAt: string;       // ISO datetime
  lastLoginAt: string|null;// ISO datetime
  _recovered?: boolean;    // 从备份恢复创建的标记
}
```

## Book

```ts
{
  id: string;              // uid('book')
  ownerId: string;         // 账本所有者（用户名）
  name: string;            // 账本名，如「个人账本」「家庭账本」
  type: 'personal' | 'shared';
  createdAt: string;
}
```

## Record

```ts
{
  id: string;              // uid('rec')
  ownerId: string;         // 记录所有者（=createdBy）
  bookId: string;          // 所属账本
  type: 'expense' | 'income';
  amount: number;          // 正数
  categoryId: string;
  note: string;            // ≤50 字
  occurredAt: string;      // ISO datetime（用户可改）
  createdAt: string;
  updatedAt: string;
}
```

## Category

```ts
{
  id: string;
  ownerId: string;         // 预置分类每个用户首次登录时拷贝到自己名下
  name: string;
  icon: string;            // Material Symbols Outlined icon key
  type: 'expense' | 'income';
  isPreset: boolean;
  sortOrder: number;
}
```

### 预置分类清单

支出：餐饮美食、交通出行、购物、娱乐、居家、通讯、医疗、学习、社交、服饰、其他
收入：工资、奖金、报销、转账、投资、其他

## Budget

```ts
{
  id: string;
  ownerId: string;
  bookId: string|null;
  scope: 'total' | 'category';
  categoryId: string|null; // scope=category 时必填
  amount: number;
  period: 'monthly';       // V1 仅月度
  startDate: string;       // YYYY-MM-DD
}
```

## JSON 备份格式

```json
{
  "version": "1.0.1",
  "exportedAt": "2026-10-09T08:00:00.000Z",
  "ownerId": "demo",
  "users": { "demo": { "salt": "...", "hash": "...", ... } },
  "books":     [ { "id": "...", "ownerId": "demo", ... } ],
  "records":   [ { "id": "...", "ownerId": "demo", ... } ],
  "categories":[ { "id": "...", "ownerId": "demo", ... } ],
  "budgets":   [ { "id": "...", "ownerId": "demo", ... } ]
}
```

> 注意：`users` 字段包含 passwordHash；备份文件本身**不含明文密码**，仅含
> 「重新用新密码登录需要的 salt + hash」。导入同名账号时，系统会：
> - 覆盖策略：直接用备份中的 salt + hash 替换当前账号；
> - 合并策略：保留当前账号的 salt + hash，仅合并业务数据。

## 数据隔离策略

所有 `storage.js` 暴露的查询接口均强制按 `getCurrentOwnerId()` 过滤，例如：

```js
export function getRecordsByOwner(ownerId) {
  return getRecords().filter(r => r.ownerId === ownerId);
}
```

切换账号后（`setCurrentOwnerId(newUsername)`），所有页面再次渲染时自动
展示新账号的数据。**不会出现 A 账号看到 B 账号数据的情况**。

## 迁移：V1.0 → V1.0.1

旧版（V1.0）的 `ma_records` / `ma_books` 中 `ownerId` 可能为 `null` /
`undefined`。`storage.js#detectLegacyData()` 在登录后扫描这些记录，并在
`index.html` 登录成功时询问用户是否导入当前账号（PRD §5.2 / §7.3）。
确认后通过 `migrateLegacyDataToOwner(ownerId)` 给所有 legacy 记录打上
当前 ownerId。

## 安全注意

1. **明文密码绝不入库**：注册成功后 grep `ma_users` 看不到任何明文密码，
   仅看到 salt + hash（PRD §9 / §11 验收）。
2. **登录失败统一提示**：`用户名或密码错误`，不区分两者以防枚举（PRD §11）。
3. **退出登录清 session**：调用 `auth.js#logout()` 后 `ma_current_userId`
   被 `localStorage.removeItem` 删除，业务页守卫自动跳 `index.html`。
4. **5 次失败冷却**：连续 5 次错误后冷却 30 秒，`cooldown-notice` 显示倒计时。