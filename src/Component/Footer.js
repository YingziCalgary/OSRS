import {year, email} from './Constant';

function Footer () {
    return (
        <>
            <footer className="bg-secondary text-light">
                <div className="container-fluid">
                    <span>Copyright &copy; {year}</span>
                    <address>
                        <a href = "mailto: yingzi1.calgary@gmail.com">{email}</a>
                    </address>
                </div>
            </footer>
        </>
    )
}

export default Footer;
