import Foundation
import Vision
import AppKit

// 얼굴 박스 검출 (macOS Vision). 사용: faces <이미지...>
// 출력 한 줄: <경로> <W> <H> [x,y,w,h ...]  (픽셀, 좌상단 기준)
let args = Array(CommandLine.arguments.dropFirst())
for path in args {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("\(path) ERR"); continue }
  let req = VNDetectFaceRectanglesRequest()
  let handler = VNImageRequestHandler(cgImage: cg, options: [:])
  do { try handler.perform([req]) } catch { print("\(path) ERR"); continue }
  let W = cg.width, H = cg.height
  var out = "\(path) \(W) \(H)"
  for f in (req.results ?? []) {
    let b = f.boundingBox
    let x = Int(b.origin.x * CGFloat(W)); let y = Int((1 - b.origin.y - b.height) * CGFloat(H))
    let w = Int(b.width * CGFloat(W)); let h = Int(b.height * CGFloat(H))
    out += " \(x),\(y),\(w),\(h)"
  }
  print(out)
}
