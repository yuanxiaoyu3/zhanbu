class DivinationResult {
  final String id;
  final String userId;
  final String type;
  final String question;
  final Map<String, dynamic> result;
  final DateTime createdAt;

  DivinationResult({
    required this.id,
    required this.userId,
    required this.type,
    required this.question,
    required this.result,
    required this.createdAt,
  });

  factory DivinationResult.fromJson(Map<String, dynamic> json) {
    return DivinationResult(
      id: json['id'],
      userId: json['userId'],
      type: json['type'],
      question: json['question'],
      result: json['result'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}