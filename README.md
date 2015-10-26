# BBSPractice2
node.jsを用いた簡単な掲示板。ユーザー認証ありver. 勉強用。今は設計段階
  
## こうしたい
  
基本的にはUehara25/BBSPractice と同じだが、幾つか機能などを追加する。
 * ユーザー登録、認証システム(MySQL をnode-mysqlパッケージで使わせてもらって利用し実装する)
 * HTML5, CSS を使い、見栄えをもう少しよくする。
  
## 仕様
#### アクセス先について
 * '/'にアクセスした時は掲示板本体を表示
 * '/login'にアクセスしたときはログイン画面を表示
 * '/register'にアクセスしたときは登録画面を表示
 * それ以外へのアクセスは'/'へリダイレクトする
 * 遷移は遷移.pngを参照

#### ユーザー登録・認証について
 * 掲示板に初めて来たときは閲覧のみ。
 * 登録してログインしなければ書き込み出来ないようにする。
 * 登録は掲示板の右上の「登録」かログインしていない状況下での「書き込む」から。
 * 登録は「ユーザー名」と「パスワード」のみ
 * ユーザー名は被らないように、パスワードはある程度の強度があるかチェックする。
  
  
#### HTML5, CSS について
 * 基本の骨組みとなるシステムを作り終えてから色々考えてみる。
