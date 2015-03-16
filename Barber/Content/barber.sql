
/*

public BarberModel() :
	base(global::System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnection"].ConnectionString, mappingSource)
{
	OnCreated();
}

sqlmetal /code:D:\BarberModel.cs /server:(localdb)\Projects /database:Barber /views /functions /sprocs /context:BarberModel /pluralize /namespace:Barber.Models

*/

if exists (select name from sys.tables where name='Roles') drop table Roles
go
CREATE TABLE Roles
(
  RoleName varchar(200) NOT NULL,
  ApplicationName varchar(100) NOT NULL,
    CONSTRAINT PKRoles PRIMARY KEY (RoleName, ApplicationName)
)
 go
if exists (select name from sys.tables where name='UsersInRoles') drop table UsersInRoles
go
CREATE TABLE UsersInRoles
(
  UserId varchar(200) NOT NULL,
  RoleName varchar(200) NOT NULL,
  ApplicationName varchar(100) NOT NULL,
    CONSTRAINT PKUsersInRoles PRIMARY KEY (UserId, RoleName, ApplicationName)
)


if exists (select name from sys.tables where name='Users') drop table Users
go
create table Users(
	Id uniqueidentifier not null,
	Email varchar(500) null,
	UserCode varchar(900) null,
	Password varchar(max) not null,
	UserType varchar(100) not null,		--Barber, User, BarberShop
	Picture varchar(max) null,
	Name varchar(max) null,
	Gender varchar(100) not null,
	Address varchar(max) null,
	Age int null,
	RegisterDate datetime not null,
	Signature varchar(max),
	constraint PK_Users_Id primary key (Id),
	constraint UQ_Users_UserCode unique (UserCode)
)
go

if exists (select name from sys.tables where name='Fans') drop table Fans
go
create table Fans(
	Id int identity(1,1),
	BarberId uniqueidentifier not null,
	UserId uniqueidentifier not null,
	LikeDate datetime default getdate(),
	constraint PK_Fans_Id primary key (Id)
)
go


if exists (select name from sys.tables where name='Tags') drop table Tags
go
create table Tags(
	Id int identity(1,1),
	BarberId uniqueidentifier not null,
	TagName varchar(max),
	TagDate datetime,
	constraint PK_Tags_Id primary key (Id)
)
go

if exists (select name from sys.tables where name='Skills') drop table Skills
go
create table Skills(
	Id int identity(1,1),
	BarberId uniqueidentifier not null,
	SkillName varchar(max),
	SkillDate datetime,
	constraint PK_Skills_Id primary key (Id)

)
go

if exists (select name from sys.tables where name='Barberers') drop table Barberers
go
create table Barberers(
	BarberId uniqueidentifier not null,
	ShopName varchar(max),
	Score int,
	constraint PK_Barbers_BarberId primary key (BarberId)
)
go

if exists (select name from sys.tables where name='Scores') drop table Scores
go
create table Scores(
	Id int identity(1,1),
	BarberId uniqueidentifier,
	ScorerId uniqueidentifier,
	Score int,
	ScoreDate datetime
)
go

if exists (select name from sys.tables where name='Reserves') drop table Reserves
go
create table Reserves(
	Id uniqueidentifier not null,
	StartDate datetime not null,
	EndDate datetime not null,
	BarberId uniqueidentifier not null,
	UserId uniqueidentifier not null,
	Description varchar(max),
	constraint PK_Reserves_Id primary key (Id)
)
go


if exists (select name from sys.tables where name='Tweets') drop table Tweets
go
create table Tweets(
	Id int identity(1,1),
	UserId uniqueidentifier not null,
	Content nvarchar(max),
	PublishDate datetime,
	constraint PK_Tweets_Id primary key (Id)
)
go


if exists (select name from sys.tables where name='Comments') drop table Comments
go
create table Comments(
	Id int identity(1,1),
	UserId uniqueidentifier not null,
	TweetId int not null,
	Content nvarchar(max),
	PublishDate datetime,
	constraint PK_Comments_Id primary key (Id)
)


if exists (select name from sys.tables where name='Messages') drop table Messages
go
create table Messages(
	Id int identity not null,
	ReceiverId uniqueidentifier not null, 
	CommitId uniqueidentifier not null,
	Content varchar(max),
	GenerateDate datetime not null default getdate(),
	IsRead bit not null default 0,
	MessageType varchar(100),
	constraint PK_Messages_Id primary key (Id)
)

go
--data
insert into Roles(RoleName, ApplicationName) values('Barber', 'barber'), ('User', 'barber')
