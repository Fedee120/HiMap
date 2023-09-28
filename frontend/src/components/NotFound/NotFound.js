import './NotFound.scss';
const NotFound = () => {
    return(
        <div className="Container">
            <img src="/static/media/Bear.be1ade396cde4d53bf41.png" alt="Bear" className='Bear' />
            <div className="Not-results">
                Sorry, not results found
            </div>
            <div className='Second-not-results'>
                We couldn’t find what you’re looking for 
            </div>
        </div>
    )
}

export default NotFound;