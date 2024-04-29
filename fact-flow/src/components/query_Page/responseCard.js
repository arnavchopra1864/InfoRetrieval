import './responseCard.scss'

function ResponseCard(props) {
    return (
        <div className="cards">

            <article className="information [ card ] resp">
                <h2 className="title-response">{props.query}</h2>
                <p className="info-response">{props.text}</p>
                {/* <button class="button">
                    <span>Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                    </svg>
                </button> */}
                {/* <span class="tag">{props.link}</span> */}
            </article>

        </div>
    )
}

export default ResponseCard;