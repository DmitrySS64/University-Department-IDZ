import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";
import {Container, Nav} from "react-bootstrap";
import {ERouterPath} from "@/shared/enum/route";
import "./index.scss"

const NavbarCustom = () => {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand>Кафедра</Navbar.Brand>
                <Nav className='me-auto'>
                    <Nav.Link as={NavLink} to={ERouterPath.TEACHER} end>Преподаватели</Nav.Link>
                    <Nav.Link as={NavLink} to={ERouterPath.DISCIPLINES} end>Дисциплины</Nav.Link>
                    <Nav.Link as={NavLink} to={ERouterPath.ADDITIONAL_ACTIVITIES} end disabled>Дополнительная деятельность</Nav.Link>
                    <Nav.Link as={NavLink} to={ERouterPath.OFFICES} end disabled>Кабинеты</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavbarCustom;