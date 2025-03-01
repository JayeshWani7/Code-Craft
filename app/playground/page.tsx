"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Play, Check, Lightbulb, Code } from "lucide-react"
import CodeEditor from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CodingChallenge() {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [code, setCode] = useState(
    "// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your solution\n    }\n}",
  )
  const [output, setOutput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch from your API
    // For demo purposes, we'll use mock data with expected outputs
    const mockQuestions = [
      {
        Question: "Write a Java program to print 'Hello World' to the console.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
        Hint: "Use System.out.println() to print to the console.",
        ExpectedOutput: "Hello World",
      },
      {
        Question: "Create a program that calculates the sum of 5 and 10 and prints the result.",
        Solution:
          "public class Solution {\n    public static void main(String[] args {\n        int a = 5;\n        int b = 10;\n        int sum = a + b;\n        System.out.println(sum);\n    }\n}",
        Hint: "Declare two integer variables, add them together, and store the result in a third variable.",
        ExpectedOutput: "15",
      },
      {
        Question: "Write a program that checks if 7 is even or odd and prints the result.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        int num = 7;\n        if(num % 2 == 0) {\n            System.out.println(num + " is even");\n        } else {\n            System.out.println(num + " is odd");\n        }\n    }\n}',
        Hint: "Use the modulo operator (%) to check if a number is divisible by 2.",
        ExpectedOutput: "7 is odd",
      },
      {
        Question: "Create a program that prints the first 5 numbers in the Fibonacci sequence.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        int n1 = 0, n2 = 1, n3;\n        System.out.print(n1 + " " + n2);\n        for(int i = 2; i < 5; i++) {\n            n3 = n1 + n2;\n            System.out.print(" " + n3);\n            n1 = n2;\n            n2 = n3;\n        }\n    }\n}',
        Hint: "Start with 0 and 1, then each subsequent number is the sum of the two preceding ones.",
        ExpectedOutput: "0 1 1 2 3",
      },
      {
        Question: "Write a program to check if 'racecar' is a palindrome.",
        Solution:
          'public class Solution {\n    public static void main(String[] args) {\n        String str = "racecar";\n        String reversed = new StringBuilder(str).reverse().toString();\n        if(str.equals(reversed)) {\n            System.out.println(str + " is a palindrome");\n        } else {\n            System.out.println(str + " is not a palindrome");\n        }\n    }\n}',
        Hint: "A palindrome reads the same backward as forward. Try using StringBuilder's reverse() method.",
        ExpectedOutput: "racecar is a palindrome",
      },
    ]

    setQuestions(mockQuestions)
    setIsLoading(false)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowHint(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
    }
  }

  const handleRunCode = () => {
    setOutput("Running code...")

    // Simulate code execution with a delay
    setTimeout(() => {
      // Extract output from the code (simplified simulation)
      const simulatedOutput = simulateJavaExecution(code)
      setOutput(`Program executed successfully!\n\nOutput:\n${simulatedOutput}`)
    }, 1500)
  }

  const handleSubmitCode = () => {
    if (!currentQuestion) {
      setOutput("Error: No question selected")
      return
    }

    setOutput("Submitting solution...")

    // Simulate submission with a delay
    setTimeout(() => {
      // Extract output from the code (simplified simulation)
      const simulatedOutput = simulateJavaExecution(code)
      const expectedOutput = currentQuestion.ExpectedOutput

      // Compare with expected output
      const isCorrect = simulatedOutput.trim() === expectedOutput.trim()

      if (isCorrect) {
        setOutput(
          `✅ Correct! Your solution passed the test case.\n\nYour output: "${simulatedOutput}"\nExpected: "${expectedOutput}"`,
        )
      } else {
        setOutput(
          `❌ Incorrect. Your solution did not match the expected output.\n\nYour output: "${simulatedOutput}"\nExpected: "${expectedOutput}"`,
        )
      }
    }, 2000)
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="text-2xl font-bold text-white">Loading challenges...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">Candy Crush Coding Challenge</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Panel */}
          <Card className="lg:col-span-1 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1">
                Question {currentQuestionIndex + 1}/{questions.length}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white/30 hover:bg-white/50 text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="bg-white/30 hover:bg-white/50 text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Problem:</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">{currentQuestion?.Question}</div>

              <Button
                variant="outline"
                onClick={toggleHint}
                className="w-full bg-yellow-400/70 hover:bg-yellow-500/70 text-white border-0"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>

              {showHint && currentQuestion?.Hint && (
                <div className="mt-4 bg-yellow-400/30 backdrop-blur-sm rounded-lg p-4 text-white">
                  <p className="font-medium">💡 Hint:</p>
                  <p>{currentQuestion.Hint}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Code Editor Panel */}
          <Card className="lg:col-span-2 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gray-800/70 text-white p-3 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              <span className="font-medium">Java Editor</span>
            </div>
            <div className="h-[400px]">
              <CodeEditor value={code} onChange={setCode} language="java" />
            </div>
            <div className="p-4 bg-gray-800/50 flex gap-3">
              <Button onClick={handleRunCode} className="bg-green-500 hover:bg-green-600 text-white">
                <Play className="mr-2 h-4 w-4" />
                Run Code
              </Button>
              <Button onClick={handleSubmitCode} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Check className="mr-2 h-4 w-4" />
                Submit
              </Button>
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="lg:col-span-3 bg-white/20 backdrop-blur-lg border-0 shadow-xl rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Output:</h3>
            <div className="bg-gray-800/70 text-green-400 p-4 rounded-lg font-mono text-sm h-[150px] overflow-auto">
              {output || "Code output will appear here..."}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Add this function to simulate Java code execution
const simulateJavaExecution = (javaCode) => {
  // This is a very simplified simulation that looks for specific patterns
  // In a real application, you would use a backend service to actually run the code

  // Check for Hello World
  if (javaCode.includes('System.out.println("Hello World")')) {
    return "Hello World"
  }

  // Check for sum calculation (5 + 10)
  if (
    javaCode.includes("int a = 5") &&
    javaCode.includes("int b = 10") &&
    javaCode.includes("int sum = a + b") &&
    (javaCode.includes("System.out.println(sum)") || javaCode.includes('System.out.println("Sum: " + sum)'))
  ) {
    return javaCode.includes('"Sum: "') ? "Sum: 15" : "15"
  }

  // Check for odd/even check on 7
  if (
    javaCode.includes("int num = 7") &&
    javaCode.includes("num % 2 == 0") &&
    javaCode.includes("is even") &&
    javaCode.includes("is odd")
  ) {
    return "7 is odd"
  }

  // Check for Fibonacci sequence
  if (
    javaCode.includes("int n1 = 0") &&
    javaCode.includes("int n2 = 1") &&
    javaCode.includes("n3 = n1 + n2") &&
    javaCode.includes("System.out.print")
  ) {
    // Check if it's the first 5 numbers
    if (javaCode.includes("i < 5") || javaCode.includes("i <= 4")) {
      return "0 1 1 2 3"
    }
    // Otherwise assume it's the first 10 numbers
    return "0 1 1 2 3 5 8 13 21 34"
  }

  // Check for palindrome check on "racecar"
  if (
    javaCode.includes('String str = "racecar"') &&
    javaCode.includes("StringBuilder") &&
    javaCode.includes("reverse()") &&
    javaCode.includes("equals")
  ) {
    return "racecar is a palindrome"
  }

  // If no pattern matches, provide a generic message
  return "[Could not determine output - please check your code]"
}

