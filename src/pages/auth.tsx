import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mark } from '@/components/brand/mark'
import { NightHero } from '@/components/brand/night-hero'
import { useAuth } from '@/hooks/use-auth'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await auth.login(identifier, password)
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Credenciais inválidas')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-[2rem] bg-night lg:grid-cols-2">
      <NightHero className="relative hidden min-h-[420px] lg:block">
        <p className="absolute bottom-8 left-8 z-10 max-w-sm font-display text-3xl text-cream">
          Entra. A cidade já está a acontecer.
        </p>
      </NightHero>
      <form onSubmit={onSubmit} className="flex flex-col justify-center gap-4 bg-card p-8">
        <Mark />
        <h1 className="font-display text-3xl">Bem-vindo de volta</h1>
        <p className="text-sm text-muted-foreground">
          Contas de exemplo: ana, joao ou maria — password <code>radar123</code>
        </p>
        <div className="space-y-1">
          <Label htmlFor="id">Email ou username</Label>
          <Input
            id="id"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? 'A entrar…' : 'Entrar'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Ainda não tens conta?{' '}
          <Link to="/criar" className="text-primary">
            Cria uma
          </Link>
        </p>
      </form>
    </div>
  )
}

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await auth.register(form)
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível criar a conta')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4 rounded-[2rem] bg-card p-8 shadow-sm"
    >
      <h1 className="font-display text-3xl">Junta-te à cidade</h1>
      <p className="text-sm text-muted-foreground">
        Um nome, um username, e começas a seguir o que te apetece.
      </p>
      {(
        [
          ['name', 'Nome', 'text'],
          ['username', 'Username', 'text'],
          ['email', 'Email', 'email'],
          ['password', 'Password', 'password'],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key} className="space-y-1">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={type}
            required
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          />
        </div>
      ))}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? 'A criar…' : 'Criar conta'}
      </Button>
      <p className="text-sm text-muted-foreground">
        Já tens conta?{' '}
        <Link to="/entrar" className="text-primary">
          Entra
        </Link>
      </p>
    </form>
  )
}
