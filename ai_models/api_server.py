from flask import Flask, request, jsonify
from model_setup import generate_learning_plan, generate_content
import logging

app = Flask(__name__)

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/api/generate-plan', methods=['POST'])
def api_generate_plan():
    try:
        data = request.json
        required_fields = ['discipline', 'goal', 'style']
        
        # 验证必填字段
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"缺少必填字段: {field}"}), 400
        
        # 调用模型生成学习计划
        plan = generate_learning_plan(
            data['discipline'],
            data['goal'],
            data['style']
        )
        
        return jsonify(plan)
    
    except Exception as e:
        logger.error(f"生成计划时发生错误: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-content', methods=['POST'])
def api_generate_content():
    try:
        data = request.json
        required_fields = ['discipline', 'format', 'topic']
        
        # 验证必填字段
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"缺少必填字段: {field}"}), 400
        
        # 调用模型生成内容
        content = generate_content(
            data['discipline'],
            data['format'],
            data['topic']
        )
        
        return jsonify(content)
    
    except Exception as e:
        logger.error(f"生成内容时发生错误: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=False) 