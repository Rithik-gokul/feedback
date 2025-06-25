import datetime

def feedback_schema(manager_id, employee_id, strengths, improvements, sentiment, tags=None):
    return {
        'manager_id': manager_id,
        'employee_id': employee_id,
        'strengths': strengths,
        'improvements': improvements,
        'sentiment': sentiment,  # 'positive', 'neutral', 'negative'
        'timestamp': datetime.datetime.utcnow(),
        'acknowledged': False,
        'tags': tags or [],
    } 