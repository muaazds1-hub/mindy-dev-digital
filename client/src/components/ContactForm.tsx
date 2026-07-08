import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { NeonButton } from "./NeonButton";
import { Send, Loader2 } from "lucide-react";

type FormData = typeof api.inquiries.create.input._type;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(api.inquiries.create.input),
  });

  const { mutate: sendInquiry, isPending } = useCreateInquiry();

  const onSubmit = (data: FormData) => {
    sendInquiry(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="space-y-1">
        <input
          {...register("name")}
          placeholder="Your Name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#20eca2] focus:ring-1 focus:ring-[#20eca2] transition-all"
        />
        {errors.name && <p className="text-red-400 text-sm px-2">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#20eca2] focus:ring-1 focus:ring-[#20eca2] transition-all"
        />
        {errors.email && <p className="text-red-400 text-sm px-2">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <textarea
          {...register("message")}
          placeholder="How can we help you grow?"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#20eca2] focus:ring-1 focus:ring-[#20eca2] transition-all resize-none"
        />
        {errors.message && <p className="text-red-400 text-sm px-2">{errors.message.message}</p>}
      </div>

      <NeonButton type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 mt-2">
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </NeonButton>
    </form>
  );
}
