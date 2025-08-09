import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Footer = () => {
      const currentYear = new Date().getFullYear();
    return (
       <footer className="mt-auto py-3 bg-light"> {/* Sử dụng utility classes của Bootstrap */}
      <Container>
        <Row className="align-items-center">
          {/* <Col className="text-center text-md-start"> 
            <strong>Bản quyền &copy; {currentYear} <a href="https://yourwebsite.com" className="text-decoration-none text-dark">Tên Veya Shop của bạn</a>.</strong>
            
          </Col> */}
         
        </Row>
      </Container>
    </footer>
    )
}

export default Footer
