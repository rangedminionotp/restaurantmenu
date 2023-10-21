import './Menu.css'
import SharedContext from './utility/context';
function Menu(){
    const {page, setPage} = React.useContext(SharedContext);
    return (
        <div id='Menu'>
            <div className="menuItem">
                <div>Combo meal special</div>
                <div>One side one entree</div>
                <div>Price</div>
                <div className='menuItemPic'>pic</div>
            </div>
        </div>
    )
}

export default Menu; 
