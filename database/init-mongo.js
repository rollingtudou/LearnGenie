// MongoDB 初始化脚本

// 创建数据库和用户
db = db.getSiblingDB('learngenie');

// 创建管理员用户
db.createUser({
  user: 'admin',
  pwd: 'admin_password',  // 生产环境中应使用安全密码
  roles: [
    { role: 'readWrite', db: 'learngenie' },
    { role: 'dbAdmin', db: 'learngenie' }
  ]
});

// 创建一般用户
db.createUser({
  user: 'learngenie_app',
  pwd: 'app_password',  // 生产环境中应使用安全密码
  roles: [
    { role: 'readWrite', db: 'learngenie' }
  ]
});

// 创建索引
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.plans.createIndex({ "user_id": 1 });
db.tasks.createIndex({ "plan_id": 1 });
db.contents.createIndex({ "discipline": 1 });
db.contents.createIndex({ "format": 1 });
db.contents.createIndex({ "knowledge_tags": 1 });
db.progress.createIndex({ "user_id": 1 });
db.progress.createIndex({ "task_id": 1 });

// 创建示例数据（仅用于开发环境）
// 插入示例用户
db.users.insertMany([
  {
    username: "teacher1",
    email: "teacher1@example.com",
    password_hash: "$2b$10$fPZnPEDMKfC4KwlMKi0P.OVTnuKXSGu3JAW1PNQBzQUqLrQc7lVBS", // 明文是: teacher123
    role: "teacher",
    status: "active",
    created_at: new Date()
  },
  {
    username: "student1",
    email: "student1@example.com",
    password_hash: "$2b$10$PCGNdk0y49AgbZGiV38ZA.XwSbAJf.BJWXoHkqzQTQkQMZDED1hOm", // 明文是: student123
    role: "student",
    status: "active",
    created_at: new Date()
  }
]);

// 插入示例学科
const disciplines = ['数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'];

// 为每个学科插入示例内容
disciplines.forEach(discipline => {
  db.contents.insertOne({
    discipline: discipline,
    title: `${discipline}学习基础`,
    url: "",
    format: "text",
    creator_id: db.users.findOne({role: "teacher"})._id,
    version: 1,
    knowledge_tags: ["基础", "入门", "课前"],
    content_text: `这是${discipline}学科的基础内容示例。包括基本概念、学习方法和重要知识点。`,
    created_at: new Date()
  });
});

console.log("数据库初始化完成"); 