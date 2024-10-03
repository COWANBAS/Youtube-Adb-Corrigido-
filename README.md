Todos os creditos vai para o criador iamfugui,
corrigi o script em algumas partes, pode não afetar o uso dele em algums navegadores mas no Min Browser ele fica infuncional.

Corrigido: 

Todos os scripts aonde se tem descrito "cssSelectorArra" Esta incompleto e precisa ser completado para "cssSelectorArray" para que funcione normalmente tais como na linha de codigos  15.

![15](https://github.com/user-attachments/assets/92443fbe-0585-4f79-bd31-7d96d5c72822)

E nas linhas de codigo 110 ate a 123.

![110-123](https://github.com/user-attachments/assets/c841b203-6f4b-4040-aaa7-bcd550a8317a)

Tambem foi modificado na linha de comando 185 o script "if(video.paused && video.currentTime<1){" para usar menos cpu mudamos para "if (video && video.paused && video.currentTime < 1) {" senão o youtube consome muita cpu
principalmente com lives abertas e com chat ou replay de chats faz com que consuma muita cpu.

![185](https://github.com/user-attachments/assets/c09a8541-955c-463b-a318-de326080e35c)
