import { toast } from 'react-toastify'

interface TryCatchRequest {
  errorMessage?: string
  successMessage?: string
  onError?(): void
  onExit?(): void
  onSuccess?(): void
  request(): void | Promise<void>
}

export const tryCatchRequest = async (request: TryCatchRequest) => {
  try {
    await Promise.resolve(request.request())

    if (request.successMessage) toast.success(request.successMessage)

    request.onSuccess?.()

    return true
  } catch (error) {
    console.error(error)

    if (request.errorMessage) toast.error(request.errorMessage)

    request.onError?.()

    return false
  } finally {
    request.onExit?.()
  }
}
