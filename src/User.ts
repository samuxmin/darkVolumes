class User{
    private email:string;
    private nick:string;
    private password:string;
    private birth:Date;
    constructor(email:string,nick:string,password:string,birth:Date){
        this.email = email;
        this.nick = nick;
        this.password = password;
        this.birth = birth;
    }
}