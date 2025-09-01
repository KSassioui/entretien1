import "./Offers.css";

export default function Offers({ offers }) {
    return (
        <div className="offers-grid">
            {offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                    <div className="offer-header">
                        <div className="offer-avatar"></div>
                        <h3 className="offer-title">{offer.title}</h3>
                    </div>
                    <p>{offer.description}</p>
                    <p><b>Lieu:</b> {offer.location}</p>
                </div>
            ))}
        </div>
    );
}










