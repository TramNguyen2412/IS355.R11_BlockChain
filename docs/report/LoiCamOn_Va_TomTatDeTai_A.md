# LỜI CẢM ƠN VÀ TÓM TẮT BÁO CÁO (BẢN CHUẨN WORD)

## LỜI CẢM ƠN

Đầu tiên, chúng em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Ban Giám hiệu, cùng toàn thể quý thầy cô Trường Đại học Công nghệ Thông tin – Đại học Quốc gia TP.HCM, đặc biệt là quý thầy cô Khoa Hệ thống Thông tin đã tận tâm giảng dạy, truyền đạt những kiến thức quý báu cho chúng em trong suốt thời gian học tập tại trường. Những kiến thức nền tảng vững chắc đó chính là hành trang vô giá giúp chúng em có đủ tự tin và năng lực để nghiên cứu, thực hiện đồ án môn học Blockchain này.

Đặc biệt, chúng em xin bày tỏ lòng biết ơn sâu sắc nhất đến Thầy ThS. Hà Lê Hoài Trung – người đã trực tiếp giảng dạy, hướng dẫn, định hướng và tận tình chỉ bảo chúng em trong suốt quá trình thực hiện đề tài. Nhờ có sự dìu dắt cùng những lời khuyên chuyên môn sắc bén của Thầy mà chúng em đã vượt qua được những khó khăn, bỡ ngỡ để hoàn thiện được một kiến trúc hệ thống phi tập trung hoàn chỉnh. Thầy không chỉ truyền đạt kiến thức mà còn truyền cảm hứng và tinh thần nghiên cứu khoa học cho chúng em.

Dù đã nỗ lực hết sức mình để nghiên cứu và hoàn thiện đồ án với đề tài “MediChain – Hệ thống quản lý bảo hiểm y tế phi tập trung”, nhưng do kiến thức chuyên môn và thời gian thực hiện còn hạn chế, báo cáo chắc chắn không tránh khỏi những thiếu sót. Chúng em rất mong nhận được sự quan tâm, đánh giá và những lời góp ý quý báu từ Hội đồng chấm bảo vệ cùng quý thầy cô. Đó sẽ là những bài học kinh nghiệm sâu sắc để chúng em tiếp tục hoàn thiện bản thân và vững bước hơn trên con đường sự nghiệp trong tương lai.

Chúng em xin chân thành cảm ơn!

## TÓM TẮT BÁO CÁO

Quy trình quản lý bảo hiểm y tế truyền thống hiện nay thường mất nhiều thời gian xét duyệt hồ sơ giấy tờ, thiếu minh bạch trong khâu đối soát và tiềm ẩn rủi ro lộ thông tin bệnh án khi lưu trữ tập trung. Để khắc phục những hạn chế này, đồ án xây dựng hệ thống quản lý bảo hiểm y tế phi tập trung MediChain trên nền tảng Blockchain Ethereum kết hợp lưu trữ IPFS. Hệ thống sử dụng Smart Contract để quản lý các gói bảo hiểm, phát hành thẻ bảo hiểm dưới dạng NFT không thể chuyển nhượng (Soulbound Token) nhằm tránh tình trạng mượn thẻ, đồng thời tự động hóa quy trình tiếp nhận, xác nhận chi phí từ bệnh viện và chi trả bồi thường trực tiếp cho người bệnh. Bên cạnh đó, hồ sơ bệnh án và hóa đơn được mã hóa trước khi đưa lên IPFS để đảm bảo quyền riêng tư.

Hệ thống đã được hiện thực hoàn chỉnh với đầy đủ ba phân hệ dành cho Bệnh nhân, Bệnh viện và Công ty Bảo hiểm. Qua kiểm thử trên Hardhat, toàn bộ 34/34 ca kiểm thử (Unit Test) đều đạt yêu cầu, đảm bảo đúng các ràng buộc về hạn mức chi trả, thời hạn thẻ và phân quyền giữa các vai trò. Nhóm cũng đã triển khai và chạy thử nghiệm thành công toàn bộ quy trình khép kín trên mạng Ethereum Sepolia Testnet, cho thấy giao dịch diễn ra nhanh chóng, minh bạch và chi phí gas hợp lý. Kết quả của đồ án chứng minh tính khả thi khi ứng dụng Blockchain vào việc hiện đại hóa và tăng tính tin cậy cho hệ thống bảo hiểm y tế.
