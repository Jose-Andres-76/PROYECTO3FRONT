import { Component, ViewChild, ElementRef, inject, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiChatService, ChatMessage } from '../../../../../services/gemini-chat.service';

@Component({
  selector: 'app-eco-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eco-chat.component.html',
  styleUrls: ['./eco-chat.component.scss']
})
export class EcoChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  private geminiChatService = inject(GeminiChatService);

  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  isSendingMessage = false;
  currentTime = new Date();

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendChatMessage() {
    if (!this.newMessage.trim() || this.isSendingMessage) return;

    const userMessage: ChatMessage = {
      id: this.geminiChatService.generateMessageId(),
      text: this.newMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.chatMessages.push(userMessage);
    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.isSendingMessage = true;

    try {
      this.geminiChatService.sendMessage(messageToSend).subscribe({
        next: (response) => {
          const aiMessage: ChatMessage = {
            id: this.geminiChatService.generateMessageId(),
            text: response,
            isUser: false,
            timestamp: new Date()
          };
          
          this.chatMessages.push(aiMessage);
          this.isSendingMessage = false;
        },
        error: (error) => {
          console.error('Error al enviar mensaje:', error);
          const errorMessage: ChatMessage = {
            id: this.geminiChatService.generateMessageId(),
            text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
            isUser: false,
            timestamp: new Date()
          };
          this.chatMessages.push(errorMessage);
          this.isSendingMessage = false;
        }
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.isSendingMessage = false;
    }
  }

  onEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendChatMessage();
    }
  }

  clearChat() {
    this.chatMessages = [];
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }
}
