'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, type SignInFormValues } from '@/lib/validation/auth'
import { useAuth } from '@/providers/auth-provider'
import { Github, Mail } from 'lucide-react'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { signIn } = useAuth()
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: SignInFormValues) {
    signIn(values.email)
    reset()
    onClose()
  }

  function mockSignIn(email: string) {
    signIn(email)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-surface-elevated/95 backdrop-blur-lg text-foreground border-overlay/15">
        <DialogTitle className="text-2xl font-bold text-center">Sign In</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in with a mock account to preview the investor experience.
        </DialogDescription>

        <div className="grid gap-6">
          <div className="space-y-2 text-center">
            <p className="text-foreground-muted">Choose your preferred sign in method</p>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-overlay/5 border-overlay/15 hover:bg-overlay/10 text-foreground space-x-2"
              onClick={() => mockSignIn('demo@github.com')}
            >
              <Github className="h-5 w-5" />
              <span>Continue with Github</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-overlay/5 border-overlay/15 hover:bg-overlay/10 text-foreground space-x-2"
              onClick={() => mockSignIn('demo@email.com')}
            >
              <Mail className="h-5 w-5" />
              <span>Continue with Email</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-overlay/15" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-elevated px-2 text-foreground-muted">Or</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground-soft">
                Email
              </Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="bg-overlay/5 border-overlay/15 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand"
                {...register('email')}
              />
              {errors.email ? (
                <p id="email-error" role="alert" className="text-sm text-red-600 dark:text-red-300">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground-soft">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="bg-overlay/5 border-overlay/15 text-foreground placeholder:text-foreground-subtle focus-visible:ring-brand"
                {...register('password')}
              />
              {errors.password ? (
                <p id="password-error" role="alert" className="text-sm text-red-600 dark:text-red-300">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm">
            <a href="#" className="text-brand hover:text-brand-hover">
              Forgot password?
            </a>
          </div>

          <div className="text-center text-sm text-foreground-muted">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-brand hover:text-brand-hover">
              Sign up
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
