import Navbar from 'react-bootstrap/Navbar';
import {Container, Nav} from "react-bootstrap";

const NavbarCustom = () => {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand>Кафедра</Navbar.Brand>
                <Nav className='me-auto'>
                    <Nav.Link href="teachers">Преподователи</Nav.Link>
                    <Nav.Link href="disciplines">Дисциплины</Nav.Link>
                    <Nav.Link href="additional_activities">Дополнительная деятельность</Nav.Link>
                    <Nav.Link href="offices">Кабинеты</Nav.Link>

                </Nav>
            </Container>

        </Navbar>
    )
}

export default NavbarCustom;