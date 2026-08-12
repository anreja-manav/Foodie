import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../../Assests/Logo.jpg"
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaCartShopping } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { MdLiveHelp } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from "../../App";
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";


const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {

  const context = useContext(MyContext);
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isOpenCatPanel, setIsOpenCatPanel] = React.useState(false);
  const [isOpenNavPanel, setIsOpenNavPanel] = React.useState(false);

  const isMobile = context?.windowWidth <= 992;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    localStorage.clear();
    context?.setIsLogin(false);
    context?.setUserData(null);
    context?.setCartData([]);
    context.alertBox("success", "Logged out successfully");

    history("");
    setIsOpenNavPanel(false);
  };

  return (
    <>
      <header className= "bg-white w-full! sticky top-0 z-50">
          <div className=" header  flex flex-row items-center justify-between gap-4 lg:gap-3 border-5-white mb-3! mx-20!">
            

            <div className="col1 w-[30%] lg:w-[15%] relative group overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
              <Link to={"/"}>
                <img src={logo} alt="Logo" className="relative z-10" />
              </Link>
            </div>

          {/* Desktop nav — hidden below the mobile breakpoint */}
          <div className="col3 hidden lg:flex items-center flex-1 justify-end pl-4 xl:pl-7 text-black! gap-1">
            <ul className="flex items-center justify-end gap-1 xl:gap-3 flex-wrap">
              {
                context.isLogin === false ?
                  (
                    <li className="list-none">
                      <Tooltip title="Login" placement="top">
                        <Link
                          to="/login"
                          className="link transition flex items-center text-[13px] xl:text-[15px] font-bold whitespace-nowrap"
                        >
                          <IconButton aria-label="login">
                            <StyledBadge
                              color="secondary"
                            >
                              <HiOutlineUserCircle />
                            </StyledBadge>
                          </IconButton>
                          Login

                        </Link>{" "}
                      </Tooltip>
                    </li>
                  ) : (
                    <>
                      <Button className="text-black! myAccountWrap flex items-center gap-2 xl:gap-3 max-w-[10rem] xl:max-w-[12rem]" onClick={handleClick}>
                        <Button className="w-8! h-8! min-w-8! xl:w-10! xl:h-10! xl:min-w-10! rounded-full! bg-[#f1f1f1]! shrink-0">
                          <FaRegUser className="text-[14px] xl:text-[16px] text-[rgba(0,0,0,0.7)]" />
                        </Button>
                        <div className="info flex flex-col min-w-0">
                          <h4 className="leading-3 text-[12px] xl:text-[13px] text-black! font-medium mb-0 capitalize text-left justify-start truncate">{context?.userData?.Name}</h4>
                        </div>
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <Link to="/my-account" className="w-full block">
                          <MenuItem onClick={handleClose} className="flex gap-2 py-2!">
                            <FaRegUser className="text-[18px]" /><span className="text-[14px]">My Account</span>
                          </MenuItem>
                        </Link>
                        <Link to="/my-orders" className="w-full block">
                          <MenuItem onClick={handleClose} className="flex gap-2 py-2!">
                            <IoBagCheckOutline className="text-[18px]" /> <span className="text-[14px]">Orders</span>
                          </MenuItem>
                        </Link>
                        <Link>
                          <MenuItem className="flex gap-2 py-2!">
                            <IoIosLogOut className="text-[18px]" /><span className="text-[14px]" onClick={logout}>Logout</span>
                          </MenuItem>
                        </Link>

                        <Divider />
                      </Menu>
                    </>
                  )}

              <li>
                <Tooltip title="Help" placement="top">
                  <Link
                    to="/help"
                    className="link transition flex items-center text-[13px] xl:text-[15px] font-bold whitespace-nowrap"
                  >
                    <IconButton aria-label="help">
                      <StyledBadge
                        color="secondary"
                      >
                        <MdLiveHelp />
                      </StyledBadge>
                    </IconButton>
                    Help

                  </Link>
                </Tooltip>
              </li>

            </ul>
          </div>

          {/* Mobile trigger — only below the breakpoint */}
          <button
            aria-label={isOpenNavPanel ? "Close menu" : "Open menu"}
            onClick={() => setIsOpenNavPanel((prev) => !prev)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 text-[22px] text-black shrink-0"
          >
            {isOpenNavPanel ? <IoClose /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile nav panel — slides open beneath the header */}
        {isOpenNavPanel && (
          <div className="lg:hidden border-t border-black/10 bg-white px-4 sm:px-6 py-3">
            <ul className="flex flex-col gap-1">
              {context.isLogin === false ? (
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpenNavPanel(false)}
                    className="flex items-center gap-3 py-2.5 text-[14px] font-bold text-black!"
                  >
                    <HiOutlineUserCircle className="text-[20px]" />
                    Login
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/my-account"
                      onClick={() => setIsOpenNavPanel(false)}
                      className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-black!"
                    >
                      <FaRegUser className="text-[18px]" />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-orders"
                      onClick={() => setIsOpenNavPanel(false)}
                      className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-black!"
                    >
                      <IoBagCheckOutline className="text-[18px]" />
                      Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-black! w-full text-left"
                    >
                      <IoIosLogOut className="text-[18px]" />
                      Logout
                    </button>
                  </li>
                  <Divider />
                </>
              )}
              <li>
                <Link
                  to="/help"
                  onClick={() => setIsOpenNavPanel(false)}
                  className="flex items-center gap-3 py-2.5 text-[14px] font-medium text-black!"
                >
                  <MdLiveHelp className="text-[18px]" />
                  Help
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;