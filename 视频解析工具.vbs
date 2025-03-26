Option Explicit

' 设置变量
Dim WshShell, fso, currentDir, batFilePath, objShell

' 创建对象
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("Shell.Application")

' 获取当前目录
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

' 批处理文件路径
batFilePath = currentDir & "\启动视频解析工具.bat"

' 检查批处理文件是否存在
If Not fso.FileExists(batFilePath) Then
    MsgBox "找不到启动脚本：" & batFilePath, vbCritical, "错误"
    WScript.Quit
End If

' 显示启动消息
MsgBox "视频解析工具即将启动，请稍候..." & vbCrLf & vbCrLf & _
       "启动完成后将自动打开浏览器访问应用。" & vbCrLf & vbCrLf & _
       "注意：关闭命令行窗口将停止应用运行。", vbInformation, "视频解析工具"

' 使用Shell.Application以普通权限运行批处理文件
objShell.ShellExecute "cmd.exe", "/c """ & batFilePath & """", currentDir, "open", 1

' 清理对象
Set WshShell = Nothing
Set fso = Nothing
Set objShell = Nothing 