/**
 * Modulos
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery"
/**
 * Iconos
 */
import { AiOutlineDashboard } from "react-icons/ai"
import { FaUsersCog, FaSignInAlt, FaUserPlus, FaUserEdit, FaUserMinus, FaPlus, FaMinus } from "react-icons/fa"
import { HiOutlinePencil } from "react-icons/hi"
import { BiLogOut } from "react-icons/bi"
import { BsBuilding, BsArrowBarRight, BsArrowBarLeft, BsTabletLandscape } from "react-icons/bs"
import { IoBusinessSharp } from "react-icons/io5"
import { Planet } from "react-planet"
/**
 * Estilos
 */
import "./sidebar.css";
/**
 * @author @AmelieGranados
 * Componente que renderiza la barra lateral del sistema
 * @argument {boolean} isLogged -- estado que indica si el usuario está loggeado
 * @argument {Number} tipoUsuario -- estado que indica que tipo de usuario está loggeado
 */
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            menuIsToggled: false,
            expandOption: [],
        }
        this.handleExpandBar = this.handleExpandBar.bind(this)
        this.handleClickItem = this.handleClickItem.bind(this)
    }
    componentDidMount() {
        $(document).on("click", ({ target }) => {
            const sidebar = document.getElementById("sidebar")
            const elem = $(target)
            if ($.contains(sidebar, target)
                || elem.hasClass("sidebar")
                || elem.hasClass("side-icon")
            ) {
            } else {
                this.setState({ isExpanded: false, expandOption: [] })
            }
        })
    }
    handleExpandBar() {
        this.setState({ isExpanded: !this.state.isExpanded })
        if (this.state.isExpanded) {
            this.setState({ expandOption: [] })
        }
    }
    handleClickItem(item) {
        const itemActiv = this.state.expandOption;
        itemActiv[item] = !itemActiv[item];
        this.setState({ expandOption: itemActiv });
    }
    render() {

        return (
            <nav id="sidebar" className={`sidebar fixed-left ${this.state.isExpanded ? "expand" : ""}`}>
                <ul className="sidebar-icons">
                    <li className="nav-item">
                        <div
                            className={`nav-link side-link text-white`}
                            onClick={this.handleExpandBar}
                        >
                            {
                                this.state.isExpanded ?
                                    <BsArrowBarLeft
                                        title="Expandir"
                                        color="white"
                                        size="30"
                                        className="side-icon"
                                    />
                                    :
                                    <BsArrowBarRight
                                        title="Expandir"
                                        color="white"
                                        size="30"
                                        className="side-icon"
                                    />
                            }
                        </div>
                    </li>
                    {
                        this.props.isLogged && this.props.tipoUsuario > 1 ?
                            <li className={`nav-item`}>
                                <Link to="/"
                                    className={`nav-link side-link text-white `}>
                                    <AiOutlineDashboard
                                        title="Dashboard"
                                        color="white"
                                        size="30"
                                        className="side-icon" />
                                </Link>
                            </li>
                            :
                            null
                    }
                    {/* Apartado usuarios */}
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item  ${this.state.isExpanded ? "" : "circular-menu"}`}>
                                {
                                    this.state.isExpanded ?
                                        <div
                                            className={`nav-link side-link text-white `}
                                            onClick={() => this.handleClickItem(0)}
                                        >
                                            <FaUsersCog
                                                title="Dashboard"
                                                color="white"
                                                size="30"
                                                className="side-icon" />
                                        </div>
                                        :

                                        <Planet
                                            autoClose
                                            orbitRadius={80}
                                            hideOrbit
                                            // rotation={105}
                                            centerContent={
                                                <div
                                                    className="circular-menu-center"
                                                >
                                                    <FaUsersCog
                                                        title="Administrar usuarios"
                                                        color="white"
                                                        size="30"
                                                        className="side-icon" />
                                                </div>
                                            }

                                        >
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <Link className="circular-menu-item" to="/register-user">
                                                <FaUserPlus
                                                    color="white"
                                                    size={30}
                                                    title="Registar usuario"
                                                />
                                            </Link>
                                            <Link className="circular-menu-item" to="/modify-user">
                                                <FaUserEdit
                                                    color="white"
                                                    title="Editar usuario"
                                                    size={30}
                                                />
                                            </Link>
                                            <Link className="circular-menu-item" to="/delete-user">
                                                <FaUserMinus
                                                    title="Eliminar usuario"
                                                    color="white"
                                                    size={30}
                                                />
                                            </Link>
                                            <div></div>
                                        </Planet>
                                }
                            </li>
                            :
                            null
                    }
                    {
                        this.state.expandOption[0] ?
                            <li className="submenu-spacing"
                            ></li>
                            :
                            null
                    }
                    {/* Aparatado empresas */}
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item  ${this.state.isExpanded ? "" : "circular-menu"}`}>
                                {
                                    this.state.isExpanded ?
                                        <div
                                            className={`nav-link side-link text-white `}
                                            onClick={() => this.handleClickItem(1)}
                                        >
                                            <BsBuilding
                                                title="Dashboard"
                                                color="white"
                                                size="30"
                                                className="side-icon" />
                                        </div>
                                        :
                                        <Planet
                                            autoClose
                                            orbitRadius={80}
                                            hideOrbit
                                            // rotation={105}
                                            centerContent={
                                                <div
                                                    className="circular-menu-center"
                                                >
                                                    <BsBuilding
                                                        title="Administrar empresas"
                                                        color="white"
                                                        size="30"
                                                        className="side-icon" />
                                                </div>
                                            }

                                        >
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <Link className="circular-menu-item" to="/register-company">
                                                <div className="plus">
                                                    <FaPlus
                                                        size={13}
                                                        color="white"
                                                        title="Agregar empresa"
                                                    />
                                                </div>
                                                <IoBusinessSharp
                                                    color="white"
                                                    size={30}
                                                />
                                            </Link>
                                            <Link className="circular-menu-item" to="/modify-company">
                                                <div className="pencil">
                                                    <HiOutlinePencil
                                                        size={21}
                                                        fill="white"
                                                        color="#131b25"
                                                        title="Modificar empresa"
                                                    />
                                                </div>
                                                <IoBusinessSharp
                                                    color="white"
                                                    size={30}
                                                />
                                            </Link>
                                            <Link className="circular-menu-item" to="/delete-company">
                                                <div className="plus">
                                                    <FaMinus
                                                        size={13}
                                                        color="white"
                                                        title="Eliminar empresa"
                                                    />
                                                </div>
                                                <IoBusinessSharp
                                                    color="white"
                                                    size={30}
                                                />
                                            </Link>
                                            <div></div>
                                        </Planet>
                                }
                            </li>
                            :
                            null
                    }
                    {/* end Apartado empresas */}
                    {
                        this.state.expandOption[1] ?
                            <li className="submenu-spacing"
                            ></li>
                            :
                            null
                    }
                    {/* Aparatado Experiencias */}
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item  ${this.state.isExpanded ? "" : "circular-menu"}`}>
                                {
                                    // this.state.isExpanded ?
                                    <div
                                        className={`nav-link side-link text-white `}
                                    >
                                        <Link to="/view-experience">
                                            <BsTabletLandscape
                                                title="Administrar experiencias"
                                                color="white"
                                                size="30"
                                                className="side-icon" />
                                        </Link>
                                    </div>
                                    // :
                                    // <Planet
                                    //     autoClose
                                    //     orbitRadius={80}
                                    //     hideOrbit
                                    //     // rotation={105}
                                    //     centerContent={
                                    //         <div
                                    //             className="circular-menu-center"
                                    //         >
                                    //             <Link to="/view-experience">
                                    //                 <BsTabletLandscape
                                    //                     title="Administrar experiencias"
                                    //                     color="white"
                                    //                     size="30"
                                    //                     className="side-icon" />
                                    //             </Link>
                                    //         </div>
                                    //     }

                                    // >
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <div></div>
                                    //     <Link className="circular-menu-item" to="/register-experience">
                                    //         <div className="plus">
                                    //             <FaPlus
                                    //                 size={13}
                                    //                 color="white"
                                    //                 title="Agregar experiencia"
                                    //             />
                                    //         </div>
                                    //         <BsTabletLandscape
                                    //             color="white"
                                    //             size={30}
                                    //         />
                                    //     </Link>
                                    //     <Link className="circular-menu-item" to="/modify-experience">
                                    //         <div className="pencil">
                                    //             <HiOutlinePencil
                                    //                 size={21}
                                    //                 fill="white"
                                    //                 color="#131b25"
                                    //                 title="Modificar experiencia"
                                    //             />
                                    //         </div>
                                    //         <BsTabletLandscape
                                    //             color="white"
                                    //             size={30}
                                    //         />
                                    //     </Link>
                                    //     <Link className="circular-menu-item" to="/delete-experience">
                                    //         <div className="plus">
                                    //             <FaMinus
                                    //                 size={13}
                                    //                 color="white"
                                    //                 title="Eliminar experiencia"
                                    //             />
                                    //         </div>
                                    //         <BsTabletLandscape
                                    //             color="white"
                                    //             size={30}
                                    //         />
                                    //     </Link>
                                    //     <div></div>
                                    // </Planet>
                                }
                            </li>
                            :
                            null
                    }
                    {/* end Apartado experiencias */}
                    {/* {
                        this.state.expandOption[2] ?
                            <li className="submenu-spacing"
                            ></li>
                            :
                            null
                    } */}
                    <li className="nav-item">
                        {
                            this.props.isLogged ?
                                <Link to="/logout" className="nav-link side-link text-white">
                                    <BiLogOut
                                        title="Cerrar sesión"
                                        color="white"
                                        size="30"
                                        className="side-icon"
                                    />
                                </Link>
                                :
                                <Link to="/login" className="nav-link side-link text-white">
                                    <FaSignInAlt
                                        title="Iniciar sesión"
                                        color="white"
                                        size="30"
                                        className="side-icon"
                                    />
                                </Link>
                        }
                    </li>
                </ul>
                {/*  */}
                <ul className={`sidebar-content ${this.state.isExpanded ? "expand" : ""}`}>
                    <li className="nav-item content">
                        <div
                            className={`nav-link side-link text-white`}
                            onClick={this.handleExpandBar}
                        >
                            Replegar
                        </div>
                    </li>
                    {
                        this.props.isLogged && this.props.tipoUsuario > 1 ?
                            <li className={`nav-item`}>
                                <Link to="/" className={`nav-link side-link text-white `}
                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                    Dashboards
                                </Link>
                            </li>
                            :
                            null
                    }
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item`}>
                                <div
                                    className={`nav-link side-link text-white `}
                                    onClick={() => this.handleClickItem(0)}
                                >
                                    Usuarios
                                </div>
                                {
                                    this.state.expandOption[0] ?
                                        <ul className="content-submenu">
                                            <li className="nav-item submenu">
                                                <Link to="/register-user" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Registrar
                                                </Link>
                                            </li>
                                            <li className="nav-item submenu">
                                                <Link to="/modify-user" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Modificar
                                                </Link>
                                            </li>
                                            <li className="nav-item submenu">
                                                <Link to="/delete-user" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Eliminar
                                                </Link>
                                            </li>
                                        </ul>
                                        :
                                        null
                                }
                            </li>
                            :
                            null
                    }
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item`}>
                                <div className={`nav-link side-link text-white `}
                                    onClick={() => this.handleClickItem(1)}
                                >
                                    Empresas
                                </div>
                                {
                                    this.state.expandOption[1] ?
                                        <ul className="content-submenu">
                                            <li className="nav-item submenu" >
                                                <Link to="/register-company" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Registrar
                                                </Link>
                                            </li>
                                            <li className="nav-item submenu">
                                                <Link to="/modify-company" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Modificar
                                                </Link>
                                            </li>
                                            <li className="nav-item submenu">
                                                <Link to="/delete-company" className={`nav-link side-link text-white `}
                                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                                    Eliminar
                                                </Link>
                                            </li>
                                        </ul>
                                        :
                                        null
                                }
                            </li>
                            :
                            null
                    }
                    {
                        this.props.isLogged && this.props.tipoUsuario > 2 ?
                            <li className={`nav-item`}>
                                <div className={`nav-link side-link text-white `}
                                    onClick={() => {
                                        this.handleClickItem(2)
                                    }}
                                >
                                    <Link to="/view-experience" style={{ color: "white", textDecoration: "none" }}>
                                        Experiencias
                                    </Link>
                                </div>

                            </li>
                            :
                            null
                    }
                    <li className="nav-item">
                        {
                            this.props.isLogged ?
                                <Link to="/logout" className="nav-link side-link text-white"
                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                    Cerrar sesión
                                </Link>
                                :
                                <Link to="/login" className="nav-link side-link text-white"
                                    onClick={() => this.setState({ isExpanded: false, expandOption: [] })}>
                                    Inicar sesión
                                </Link>
                        }
                    </li>
                </ul>
            </nav>
        )
    }
}