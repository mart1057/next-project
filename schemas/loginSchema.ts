// src/schemas/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("กรุณากรอกอีเมล") // ตรวจสอบว่าไม่ว่างเปล่าเป็นอันดับแรก
    .email("รูปแบบอีเมลไม่ถูกต้อง"), // ถ้าผ่านแล้วจึงมาตรวจสอบรูปแบบอีเมล
  password: z
    .string()
    .nonempty("กรุณากรอกรหัสผ่าน")
    .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
    // .nullable() ไม่บังคับกรอก
});
export type LoginFormSchema = z.infer<typeof loginSchema>
