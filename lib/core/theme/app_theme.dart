import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      primaryColor: Color(0xFF2A1B3D),
      accentColor: Color(0xFFE4B7FF),
      scaffoldBackgroundColor: Color(0xFF1A0033),
      textTheme: TextTheme(
        headline1: TextStyle(
          color: Colors.white,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
        bodyText1: TextStyle(
          color: Colors.white70,
          fontSize: 16,
        ),
      ),
    );
  }
}