class Volume{
    private author: string;
    private title: string;
    private description: string;
    private isbn: string;
    private year: number;
    private image: string;
    private stock: number;
    private categories: string[];

 
    constructor(author: string,title:string,description:string, isbn:string, year: number, image: string, stock: number, categories: string[]) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.isbn = isbn;
        this.year = year;
        this.image = image;
        this.stock = stock;
        this.categories = categories;
    }
    
}