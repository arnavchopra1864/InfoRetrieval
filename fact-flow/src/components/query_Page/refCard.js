import './refCard.scss'

function RefCard(props) {
    return (
        <div className="cards-ref">

	<article className="information [ card-ref ]">
		<h2 className="title-ref">{props.title}</h2>
		<p className="info-ref">{props.text}</p>
		{/* <button class="button">
			<span>Learn more</span>
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
			</svg>
		</button> */}
        <a href= {props.link} target="_blank"><span className="tag">{props.link}</span></a>
	</article>

</div>
    )
}

export default RefCard;