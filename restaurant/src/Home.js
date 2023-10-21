import Info from "./Info";
import Menu from "./Menu"; 
import TopBar from "./TopBar";

function Home (){
    return (
        <div id='Home'>
            <TopBar />
            <Info />
            <Menu /> 
        </div>
    )
}

export default Home;