import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { STORAGE_KEYS, readJSON } from "@pokemon-mf/shared";
import { useThemeStore } from "../state/themeStore";
import { SearchModal } from "../features/search/SearchModal";
import { LastVisitedToast } from "../features/toast/LastVisitedToast";

const HEADER_H = 56;
const BP = 720;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 999;

  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const HeaderInner = styled.div`
  height: ${HEADER_H}px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;

  display: flex;
  align-items: center;
  gap: 12px;

  flex-wrap: nowrap;
`;

const Brand = styled.div`
  font-weight: 900;
  letter-spacing: -0.2px;
  white-space: nowrap;
`;

const DesktopOnly = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  white-space: nowrap;

  @media (max-width: ${BP}px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  @media (max-width: ${BP}px) {
    display: block;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 8px;
  margin-left: 8px;

  a {
    text-decoration: none;
    color: inherit;
    padding: 8px 10px;
    border-radius: 10px;
    opacity: 0.92;
  }

  a.active {
    background: ${({ theme }) => theme.card2};
    opacity: 1;
  }
`;

const Spacer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Main = styled.main`
  width: 100%;
  padding: calc(${HEADER_H}px + 18px) 16px 42px;
  background: ${({ theme }) => theme.bg};
  min-height: calc(100vh - ${HEADER_H}px);
  isolation: isolate;
`;

const MenuWrap = styled.div`
  position: relative;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  color: inherit;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;

  transition: transform 120ms ease, opacity 120ms ease, box-shadow 120ms ease,
    background 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow};
  }

  &:active {
    transform: translateY(0);
    opacity: 0.92;
    box-shadow: none;
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
`;

const IconButton = styled(Button)`
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    display: block;
  }
`;

const MenuButton = styled(Button)`
  background: transparent;

  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 220px;

  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  border-radius: 12px;
  padding: 10px;

  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 1000;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  z-index: 1200;
`;

const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: min(86vw, 360px);
  height: 100vh;
  z-index: 1300;

  border-left: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.shadow};

  display: grid;
  grid-template-rows: ${HEADER_H}px 1fr;
`;

const DrawerTop = styled.div`
  height: ${HEADER_H}px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const DrawerBody = styled.div`
  padding: 14px;
  display: grid;
  gap: 12px;
  align-content: start;
`;

const DrawerNav = styled.nav`
  display: grid;
  gap: 8px;

  a {
    text-decoration: none;
    color: inherit;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.card2};
    font-weight: 800;
  }

  a.active {
    outline: 2px solid ${({ theme }) => theme.focus};
  }
`;

function IconHamburger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M21 14.6A8.5 8.5 0 0 1 9.4 3 7.5 7.5 0 1 0 21 14.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShellLayout() {
  const navigate = useNavigate();
  const toggleTheme = useThemeStore((s) => s.toggle);
  const mode = useThemeStore((s) => s.mode);

  const [openSearch, setOpenSearch] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useMemo(() => {
    const auth = readJSON<{ user?: string } | null>(STORAGE_KEYS.auth, null);
    return auth?.user ?? "Usuario";
  }, []);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.auth);
    navigate("/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <Header>
        <HeaderInner>
          <Brand>Pokémon MF</Brand>

          <DesktopOnly>
            <Nav>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/history">Historial</NavLink>
            </Nav>
          </DesktopOnly>

          <Spacer />

          {/* Desktop actions */}
          <DesktopOnly>
            <Button onClick={() => setOpenSearch(true)}>Buscar</Button>

            <Button onClick={toggleTheme} aria-label="Toggle theme">
              {mode === "dark" ? "Dark" : "Light"}
            </Button>

            <MenuWrap>
              <MenuButton onClick={() => setOpenMenu((v) => !v)}>
                {user}
              </MenuButton>

              {openMenu && (
                <Menu>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    Sesión iniciada
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <Button onClick={logout}>Cerrar sesión</Button>
                  </div>
                </Menu>
              )}
            </MenuWrap>
          </DesktopOnly>

          {/* Mobile actions */}
          <MobileOnly>
            <IconButton
              onClick={() => setOpenSearch(true)}
              aria-label="Buscar"
              title="Buscar"
            >
              <IconSearch />
            </IconButton>

            <IconButton
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              title="Cambiar tema"
            >
              {mode === "dark" ? <IconMoon /> : <IconSun />}
            </IconButton>

            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              title="Abrir menú"
            >
              <IconHamburger />
            </IconButton>
          </MobileOnly>
        </HeaderInner>
      </Header>

      <Main>
        <Outlet />
      </Main>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <Backdrop onClick={closeMobile} />
          <Drawer role="dialog" aria-modal="true" aria-label="Menú">
            <DrawerTop>
              <div style={{ fontWeight: 900 }}>Menú</div>
              <IconButton onClick={closeMobile} aria-label="Cerrar menú">
                <IconClose />
              </IconButton>
            </DrawerTop>

            <DrawerBody>
              <div style={{ fontSize: 13, opacity: 0.85 }}>
                Usuario: <span style={{ fontWeight: 800 }}>{user}</span>
              </div>

              <DrawerNav>
                <NavLink to="/home" onClick={closeMobile}>
                  Home
                </NavLink>
                <NavLink to="/history" onClick={closeMobile}>
                  Historial
                </NavLink>
              </DrawerNav>

              <Button
                onClick={() => {
                  closeMobile();
                  setOpenSearch(true);
                }}
              >
                Buscar
              </Button>

              <Button onClick={toggleTheme}>
                {mode === "dark" ? "Modo Dark" : "Modo Light"}
              </Button>

              <GhostButton
                onClick={() => {
                  closeMobile();
                  logout();
                }}
              >
                Cerrar sesión
              </GhostButton>
            </DrawerBody>
          </Drawer>
        </>
      )}

      <SearchModal open={openSearch} onClose={() => setOpenSearch(false)} />
      <LastVisitedToast />
    </>
  );
}
