import styled from "styled-components";
import userImage from "../assets/user-11.jpg";
import GreyText from "./GreyText";
import {
  ChevronDown,
  Info,
  Moon,
  PieChart,
  Plus,
  Settings,
  Sun,
  Menu as Humbarger,
  Users,
  Settings as SettingsIcon,
  Bookmark,
  LogOut,
} from "react-feather";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "../redux/reducers/themeSlice";
import { Menu, MenuItem } from "./Menu";
import { logout } from "../redux/reducers/userSlice";
import Logo from "./Logo";
import { setPcSidebar, setShowSidebar } from "../redux/reducers/sidebarSlice";
import IconButton from "./IconButton";
import { setContentIndex } from "../redux/reducers/contentIndexSlice";
import { disableContent } from "../redux/reducers/disableContentSlice";
import NewExamDialog from "./NewExamDialog";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import Notification from "./Notification";
import { clearPastExams } from "../redux/reducers/pastExamSlice";
import useTheme from "../hooks/useTheme";
import useDim from "../hooks/useDim";
import { clearLiveExamSlice } from "../redux/reducers/liveChallengeSlice";

const HeaderTopHolder = styled.div`
  background: ${(props) => props.color};
  display: flex;
  user-select: none;
  min-height: 55px;
  padding: 0 25px;
  z-index: 99;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
  font-family: "Poppins", sans-serif;
  position: relative;
  @media only screen and (max-width: 600px) {
    padding: 0;
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;
const HeaderHider = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999999;
`;
const HeaderTopLeft = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
`;
const HeaderTopRight = styled.div`
  height: 100%;
  width: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const Avatar = styled.img`
  height: 35px;
  width: 35px;
  border-radius: 50%;
  margin-right: 15px;
`;
const MetaHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
const UserName = styled.span`
  font-size: 14.5px;
`;
const RankText = styled.span`
  font-size: 10px;
`;
const ChevronHolder = styled.div`
  margin: 0 0 0 10px;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
const HeaderUserInfoHolder = styled.div`
  display: flex;
  align-items: center;
  ${(props) => (props.clickable ? `cursor: pointer;` : null)}
  &:hover {
    ${(props) => (props.clickable ? `opacity: 0.5;` : null)}
  }
  @media only screen and (max-width: 600px) {
    cursor: default;
  }
`;
const CategoryHolder = styled.div`
  color: ${(props) => (props.active ? "#13b2ec" : props.color)};
  font-size: ${(props) => (props.active ? "" : "15px")};
  transition: 0.1s;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 10px;
  ${(props) =>
    !props.active &&
    `cursor: pointer;
  &:hover {
    opacity: 0.5;
  }`}
  @media only screen and (max-width: 600px) {
    display: none;
    cursor: default;
  }
`;
const CategoryLabel = styled.p`
  margin: 0 10px;
  display: flex;
  align-items: center;
  color: ${(props) => props.color};
`;
const HeaderOnPhoneHolder = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
  }
`;
const MetaHolderOnPhone = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const TitleOnPhone = styled.p`
  font-size: 20px;
`;
const IconHolder = styled.div`
  ${(props) => (props.clickable ? `cursor: pointer;` : ``)}
  display: flex;
  @media only screen and (max-width: 600px) {
    cursor: default;
  }
`;
const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Category = ({ label, icon, active, onClick }) => {
  const theme = useTheme();
  return (
    <CategoryHolder color={theme.textColor} onClick={onClick} active={active}>
      <IconButton style={{ color: !active ? theme.textColor : "" }} margin="0">
        {icon}
      </IconButton>
      <CategoryLabel>{label}</CategoryLabel>
    </CategoryHolder>
  );
};

const Switcher = () => {
  const mode = useSelector((state) => state.theme.value);
  const isExamStarted = useSelector((state) => state.isExamStarted.value);
  const dispatcher = useDispatch();
  return (
    <IconButton onClick={() => !isExamStarted && dispatcher(switchTheme())}>
      {mode === "light" && <Moon size={20} />}
      {mode === "dark" && <Sun size={20} />}
    </IconButton>
  );
};

export default function HeaderTop() {
  const dispatcher = useDispatch();
  const isExamStarted = useSelector((state) => state.isExamStarted.value);
  const isGeneratingQuestion = useSelector(
    (state) => state.loading.isGeneratingQuestion
  );
  const socket = useSelector((state) => state.socket.value);
  const user = useUser();
  const [categories] = useState([
    {
      label: "New",
      icon: <Plus size={15} />,
      route: "new-exam",
    },
    // {
    //   label: "Leaderboard",
    //   icon: <Users size={15} />,
    //   route: "leaderboard",
    // },
    // {
    //   label: "Analytics",
    //   icon: <PieChart size={15} />,
    //   route: "analytics",
    // },
    // {
    //   label: "Settings",
    //   icon: <Settings size={15} />,
    //   route: "settings",
    // },
    // {
    //   label: "Info",
    //   icon: <Info size={15} />,
    //   route: "info",
    // },
  ]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [userMenu, setUserMenu] = useState(false);
  const [newExam, setNewExam] = useState(false);
  const pcSidebar = useSelector((state) => state.showSidebar.pcSidebar);
  const navigate = useNavigate();
  const theme = useTheme();
  const isPc = useDim();
  const handleNewExam = () =>
    !isExamStarted && setNewExam(!newExam) && !isGeneratingQuestion;
  const goHome = () => {
    dispatcher(disableContent(false));
    dispatcher(setContentIndex(0));
    window.answerSheet = null;
    window.onbeforeunload = () => {};
    navigate("/dashboard");
  };

  // handle logout
  const handleLogOut = () => {
    navigate("/login");
    setUserMenu(false);
    dispatcher(logout());
    dispatcher(clearPastExams());
    dispatcher(clearLiveExamSlice());
    socket && socket.disconnect();
  };

  return (
    <>
      {/* Category dialogues */}
      {activeCategory === 0 && (
        <NewExamDialog
          show={newExam}
          onClose={() => {
            handleNewExam();
            navigate("/dashboard");
          }}
          setNewExam={setNewExam}
        />
      )}
      {/* ------------------- */}
      <HeaderTopHolder color={theme.cardBg}>
        {isExamStarted && <HeaderHider />}
        <HeaderTopLeft>
          <HeaderOnPhoneHolder style={{ color: theme.textColor }}>
            <MetaHolderOnPhone>
              <IconHolder
                clickable={!isExamStarted}
                onClick={() =>
                  !isExamStarted && dispatcher(setShowSidebar(true))
                }
              >
                <Humbarger size={25} />
              </IconHolder>
              <Logo onClick={goHome} dim={35} phone />
              <TitleOnPhone onClick={goHome}>Flame</TitleOnPhone>
            </MetaHolderOnPhone>
          </HeaderOnPhoneHolder>
          {isPc && pcSidebar && (
            <IconButton
              onClick={() => dispatcher(setPcSidebar(false))}
              margin="0 20px 0 0"
            >
              <Humbarger color={theme.iconColor} size={20} />
            </IconButton>
          )}
          {categories &&
            categories.map((category, i) => (
              <Category
                key={i}
                active={i === activeCategory}
                icon={category.icon}
                label={category.label}
                onClick={() => {
                  if (!isExamStarted) {
                    setActiveCategory(i);
                    navigate(category.route);
                    if (i === 0) setNewExam(!newExam);
                  }
                }}
              />
            ))}
        </HeaderTopLeft>
        <HeaderTopRight>
          <Notification isNew={false} />
          <IconButton onClick={handleNewExam} margin="0">
            <Plus color={theme.iconColor} size={20} />
          </IconButton>
          <Switcher />
          <HeaderUserInfoHolder
            clickable={!isExamStarted}
            onClick={() => !isExamStarted && setUserMenu(true)}
          >
            <Avatar alt="user" src={userImage} />
            <MetaHolder>
              <UserName style={{ color: theme.textColor }}>
                {user?.name}
              </UserName>
              <RankText>
                <GreyText>Rank: 320</GreyText>
              </RankText>
            </MetaHolder>
            <ChevronHolder>
              <ChevronDown style={{ color: theme.textColor }} size={20} />
            </ChevronHolder>
          </HeaderUserInfoHolder>
          <Menu
            top={58}
            width={200}
            show={userMenu}
            onClose={() => setUserMenu(false)}
          >
            {user?.role === "admin" && (
              <MenuItem
                onItemClick={() => {
                  dispatcher(setContentIndex(38)); // add question code - 38
                  setUserMenu(false);
                }}
              >
                <Flex>
                  <Plus style={{ marginRight: "5px" }} size={15} />
                  Add Questions
                </Flex>
              </MenuItem>
            )}
            <MenuItem>
              <Flex>
                <Bookmark style={{ marginRight: "5px" }} size={15} />
                Bookmarked
              </Flex>
            </MenuItem>
            <MenuItem>
              <Flex>
                <SettingsIcon style={{ marginRight: "5px" }} size={15} />
                Settings
              </Flex>
            </MenuItem>
            <MenuItem onItemClick={handleLogOut}>
              <Flex>
                <LogOut style={{ marginRight: "5px" }} size={15} />
                Logout
              </Flex>
            </MenuItem>
          </Menu>
        </HeaderTopRight>
      </HeaderTopHolder>
    </>
  );
}
