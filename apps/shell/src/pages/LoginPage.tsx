import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { STORAGE_KEYS, writeJSON } from "@pokemon-mf/shared";
import { useThemeStore } from "../state/themeStore";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 16px;
`;

const Card = styled.div`
  width: min(420px, 100%);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.card};
  padding: 22px 22px 18px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 900;
  text-align: center;
`;

const ThemeRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`;

const ThemeToggle = styled.button<{ $mode: "dark" | "light" }>`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.muted};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 999px;

  &:hover {
    background: ${({ theme }) => theme.card2};
    color: ${({ theme }) => theme.text};
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ $mode, theme }) =>
      $mode === "dark" ? theme.card2 : theme.bg};
    box-shadow: inset 0 0 0 3px
      ${({ $mode }) =>
        $mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(16,24,40,0.06)"};
  }
`;

const Sub = styled.p`
  margin: 14px 0 0;
  text-align: center;
  color: ${({ theme }) => theme.muted};
`;

const Form = styled.form`
  margin-top: 14px;
  display: grid;
  gap: 12px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text};

  input {
    width: 100%;
    padding: 11px 12px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.bg};
    color: inherit;
    outline: none;

    &:focus {
      border-color: color-mix(
        in srgb,
        ${({ theme }) => theme.focus} 55%,
        ${({ theme }) => theme.border}
      );
      box-shadow: 0 0 0 3px
        color-mix(in srgb, ${({ theme }) => theme.focus} 25%, transparent);
    }
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 4px;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  font-weight: 700;

  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow};
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    opacity: 0.95;
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const toggleTheme = useThemeStore((s) => s.toggle);
  const mode = useThemeStore((s) => s.mode);

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const canSubmit = useMemo(() => user.trim().length > 0, [user]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim()) return;

    writeJSON(STORAGE_KEYS.auth, { user: user.trim() });
    navigate("/home", { replace: true });
  };

  return (
    <Page>
      <Card>
        <Title>POKEDEX</Title>

        <ThemeRow>
          <ThemeToggle type="button" onClick={toggleTheme} $mode={mode}>
            <span className="dot" aria-hidden="true" />
            Cambiar tema
          </ThemeToggle>
        </ThemeRow>

        <Sub>Ingresa un usuario para continuar.</Sub>

        <Form onSubmit={onSubmit}>
          <Field>
            Usuario
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Usuario"
              autoFocus
            />
          </Field>

          <Field>
            Contraseña
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Contraseña"
              type="password"
            />
          </Field>

          <PrimaryButton type="submit" disabled={!canSubmit}>
            Ingresar
          </PrimaryButton>
        </Form>
      </Card>
    </Page>
  );
}
