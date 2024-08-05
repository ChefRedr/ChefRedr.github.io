function Article(props) {
    if(props.description) {
        return(
            <a className="alt-black" href={props.link} target="_blank">
                <img src={props.imgsrc} alt={props.imgalt}/>
                <p className="article-title">{props.title}</p>
                <p className="article-description">{props.description}</p>
            </a>
        );
    }
    else {
        return(
            <a className="alt-black" href={props.link} target="_blank">
                <img src={props.imgsrc} alt={props.imgalt}/>
                <p className="article-title">{props.title}</p>
            </a>
        );
    }
}

export default Article;