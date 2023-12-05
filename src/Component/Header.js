import DateTime from './DateTime';
import Logo from './Logo';

function Header (props) {
   
    return (
        <>
            <h1 className='text-black'>{props.title}</h1>
            <DateTime/>
            {props.showLogo && <Logo />}
        </>
    )
}

export default Header;