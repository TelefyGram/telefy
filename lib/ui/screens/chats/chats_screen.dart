import 'package:flutter/material.dart';

import '../../../tdlib/telegram_api.dart';
import '../../../translations/translation.dart';
import '../../widgets/loading.dart';
import '../../widgets/telefy_controls.dart';

class ChatsScreen extends StatefulWidget {
  final TelegramClientApi client;

  const ChatsScreen({required this.client, super.key});

  @override
  State<ChatsScreen> createState() => _ChatsScreenState();
}

class _ChatsScreenState extends State<ChatsScreen> {
  int _tab = 0;
  late Future<List<TelegramChatInfo>> _chatsFuture;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    _chatsFuture = widget.client.getChats(archive: _tab == 1);
  }

  void _changeTab(int tab) {
    setState(() {
      _tab = tab;
      _load();
    });
  }

  Future<void> _refresh() async {
    setState(() {
      _chatsFuture = widget.client.getChats(
        archive: _tab == 1,
        forceRefresh: true,
      );
    });
    await _chatsFuture;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(tr('chats.title')),
        actions: [
          IconButton(
            tooltip: tr('chats.refresh'),
            onPressed: _refresh,
            icon: const Icon(Icons.refresh_rounded),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: SegmentedButton<int>(
              segments: [
                ButtonSegment(value: 0, label: Text(tr('chats.active'))),
                ButtonSegment(value: 1, label: Text(tr('chats.archive'))),
                ButtonSegment(value: 2, label: Text(tr('chats.channels'))),
              ],
              selected: {_tab},
              onSelectionChanged: (selection) => _changeTab(selection.first),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<TelegramChatInfo>>(
              future: _chatsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Loading());
                }
                if (snapshot.hasError) {
                  return Center(child: Text(tr('chats.loadFailed')));
                }
                var chats = snapshot.data ?? const <TelegramChatInfo>[];
                if (_tab == 2) {
                  chats = chats.where((chat) => chat.isChannel).toList();
                }
                if (chats.isEmpty) {
                  return TelefyEmptyState(message: tr('chats.empty'));
                }
                return RefreshIndicator(
                  onRefresh: _refresh,
                  child: ListView.separated(
                    itemCount: chats.length,
                    separatorBuilder: (_, _) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final chat = chats[index];
                      return ListTile(
                        leading: CircleAvatar(
                          child: Icon(
                            chat.isChannel
                                ? Icons.campaign_outlined
                                : Icons.person_outline,
                          ),
                        ),
                        title: Text(
                          chat.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        subtitle: chat.lastMessage == null
                            ? null
                            : Text(
                                chat.lastMessage!,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                ChatScreen(client: widget.client, chat: chat),
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  final TelegramClientApi client;
  final TelegramChatInfo chat;

  const ChatScreen({required this.client, required this.chat, super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();
  late Future<List<TelegramMessageInfo>> _messagesFuture;
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _messagesFuture = widget.client.getChatMessages(widget.chat.id);
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final text = _messageController.text.trim();
    if (text.isEmpty || _sending) return;
    setState(() => _sending = true);
    try {
      await widget.client.sendMessage(chatId: widget.chat.id, text: text);
      _messageController.clear();
      setState(() {
        _messagesFuture = widget.client.getChatMessages(widget.chat.id);
      });
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.chat.title)),
      body: Column(
        children: [
          Expanded(
            child: FutureBuilder<List<TelegramMessageInfo>>(
              future: _messagesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Loading());
                }
                final messages = snapshot.data ?? const <TelegramMessageInfo>[];
                if (messages.isEmpty) {
                  return TelefyEmptyState(message: tr('chats.noMessages'));
                }
                return ListView.builder(
                  reverse: true,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (_, index) => Align(
                    alignment: Alignment.centerLeft,
                    child: TelefyPanel(
                      child: Text(
                        messages[index].text.isEmpty
                            ? tr('chats.unsupportedMessage')
                            : messages[index].text,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: TelefyTextField(
                      controller: _messageController,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _send(),
                      hintText: tr('chats.messageHint'),
                    ),
                  ),
                  IconButton(
                    onPressed: _sending ? null : _send,
                    icon: const Icon(Icons.send_rounded),
                    tooltip: tr('chats.send'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
