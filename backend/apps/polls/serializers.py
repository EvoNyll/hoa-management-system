from rest_framework import serializers
from .models import Poll, PollOption, PollVote

class PollOptionSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PollOption
        fields = ['id', 'text', 'order', 'vote_count']
    
    def get_vote_count(self, obj):
        return PollVote.objects.filter(option=obj).count()

class PollVoteSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    option_text = serializers.CharField(source='option.text', read_only=True)
    
    class Meta:
        model = PollVote
        fields = ['id', 'user', 'user_name', 'option', 'option_text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    total_votes = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()
    
    class Meta:
        model = Poll
        fields = ['id', 'title', 'description', 'is_active', 'allow_multiple_choices',
                 'start_date', 'end_date', 'created_by', 'created_by_name',
                 'options', 'total_votes', 'user_voted', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_total_votes(self, obj):
        return PollVote.objects.filter(poll=obj).count()
    
    def get_user_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PollVote.objects.filter(poll=obj, user=request.user).exists()
        return False