import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Informe seu login.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

export const registerSchema = z
  .object({
    login: z
      .string()
      .trim()
      .min(3, 'O login deve possuir pelo menos 3 caracteres.')
      .max(100, 'O login deve possuir no máximo 100 caracteres.')
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        'Use somente letras, números, ponto, hífen e underline.',
      ),
    senha: z
      .string()
      .min(8, 'A senha deve possuir pelo menos 8 caracteres.')
      .max(64, 'A senha deve possuir no máximo 64 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ['confirmarSenha'],
    message: 'As senhas não coincidem.',
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
