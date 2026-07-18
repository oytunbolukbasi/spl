import PDFKit
import AppKit
import Foundation
let args = CommandLine.arguments
let path = args[1]; let pg = Int(args[2])!; let out = args[3]
let scale: CGFloat = args.count>4 ? CGFloat(Double(args[4])!) : 2.0
guard let doc = PDFDocument(url: URL(fileURLWithPath: path)), let page = doc.page(at: pg) else { print("fail load"); exit(1) }
let rect = page.bounds(for: .mediaBox)
let img = NSImage(size: NSSize(width: rect.width*scale, height: rect.height*scale))
img.lockFocus()
NSColor.white.set(); NSRect(x:0,y:0,width:rect.width*scale,height:rect.height*scale).fill()
let ctx = NSGraphicsContext.current!.cgContext
ctx.scaleBy(x: scale, y: scale)
ctx.translateBy(x: -rect.origin.x, y: -rect.origin.y)
page.draw(with: .mediaBox, to: ctx)
img.unlockFocus()
let tiff = img.tiffRepresentation!
let bmp = NSBitmapImageRep(data: tiff)!
let png = bmp.representation(using: .png, properties: [:])!
try! png.write(to: URL(fileURLWithPath: out))
print("ok \(rect.width)x\(rect.height)")
