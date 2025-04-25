export class ErrorHelper {
  static getMessage(error: any) {
    let errorMessage = '';

    if (error.status === 0) {
      // client-side error
      errorMessage = 'Ошибка подключения к серверу';
    } else {
      // server-side error
      try {
        errorMessage = error.error.message;
      } catch {
        errorMessage = error.status + ':' + error.message;
      }
    }

    return errorMessage;
  }
}
